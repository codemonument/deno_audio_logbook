import postcss from "postcss";
// See: https://www.npmjs.com/package/postcss-jit-props
import postcssJitProps from "postcss-jit-props";
// See: https://www.npmjs.com/package/open-props
import OpenProps from "open-props";
import postcssImport from "postcss-import";
import { log } from "@/src/log.ts";
import { expandGlob, WalkEntry } from "std_fs";
import { encode as encodeBase64 } from "std_encoding_base64";
import { cssCache } from "./cssCache.ts";

// FIXME: Why does this logger not log at the start?!?
const logger = log.getLogger("deno_audio_logbook");

export const postcssInstance = postcss([
  postcssImport({
    addModulesDirectories: ["css_deps"],
  }),
  postcssJitProps(OpenProps),
]);

async function loadProcessAndCacheCss(file: WalkEntry) {
  const fsPath = file.path;

  // Load input css file
  const rawCssContent = await Deno.readTextFile(fsPath);

  // Calc SHA256
  const rawCssBytes = new TextEncoder().encode(rawCssContent);
  const fileHashBytes = await crypto.subtle.digest("SHA-256", rawCssBytes);
  const fileHash = encodeBase64(fileHashBytes);

  const processingResult = await postcssInstance.process(rawCssContent, {
    from: fsPath,
  });
  cssCache.set(fileHash, processingResult.css);

  console.debug(`PostCSS Transformed and Cached: ${fsPath}`, { fileHash });
}

/**
 * Process css files and store them in css cache at server start
 */
export async function prefillCssCache() {
  const cssFileEntries = expandGlob("css/*.css", { root: Deno.cwd() });
  for await (const file of cssFileEntries) {
    await loadProcessAndCacheCss(file);
  }

  const cssStaticEntries = expandGlob("static/*.css", { root: Deno.cwd() });
  for await (const file of cssStaticEntries) {
    await loadProcessAndCacheCss(file);
  }
}
