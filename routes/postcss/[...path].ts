/**
 * Configures postcss with openprops as standalone file
 * (copy-pasteable)
 */

import { HandlerContext } from "$fresh/server.ts";
import * as log from "$std/log/mod.ts";
import { cssCache } from "@/src/css-cache/cssCache.ts";
import { encode as encodeBase64 } from "$std/encoding/base64.ts";
import { z } from "zod";
import { postcssInstance } from "@/src/css-cache/postcssInstance.ts";


log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    "postcss_route": {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

const logger = log.getLogger("postcss_route");

export const handler = async (
  _req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  const webservPath = ctx.params.path;
  const fsPath = `css/${webservPath}`;

  // Load input css file
  const rawCssContent = await Deno.readTextFile(fsPath);

  // Calc SHA256
  const rawCssBytes = new TextEncoder().encode(rawCssContent);
  const fileHashBytes = await crypto.subtle.digest("SHA-256", rawCssBytes);
  const fileHash = encodeBase64(fileHashBytes);

  // FIXME: Why do I not have typings for cssCache here?!?
  // Check cache
  if (!await cssCache.has(fileHash)) {
    // On cache miss: process css file and cache it
    const processingResult = await postcssInstance.process(rawCssContent, {
      from: fsPath,
    });
    cssCache.set(fileHash, processingResult.css);
    logger.debug(`PostCSS Transformed: ${fsPath}`, { fileHash });
  }

  // Get storedCSS from cache
  const storedCSSResult = z.string().safeParse(await cssCache.get(fileHash));

  if (storedCSSResult.success === false) {
    return ctx.renderNotFound();
  }

  logger.debug(`PostCSS found in cache: ${fsPath}`, { fileHash });

  // deliver stored css
  return new Response(storedCSSResult.data, {
    headers: new Headers([
      ["Content-Type", "text/css"],
    ]),
  });
};
