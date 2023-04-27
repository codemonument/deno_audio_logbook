import { ensureDir } from "https://deno.land/std@0.178.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.178.0/path/mod.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import {
  ArgumentValue,
  Command,
} from "https://deno.land/x/cliffy@v0.25.7/mod.ts";
import { ZodSemver } from "https://deno.land/x/zod_semver@1.0.2/mod.ts";

await new Command()
  .name("download-openprops")
  .description(
    `Downloads the specified version of openprops into a local directory for further use`,
  )
  .option(
    "- --outPath <outPath>",
    "The output path to save the openprops files to. Defaults to <cwd>/css_deps/open-props",
  )
  .type("semver", ({ label, name, value }: ArgumentValue) => {
    return ZodSemver.parse(value);
  })
  .arguments("<openpropsVersion:semver>")
  .action(async (options, ...args) => {
    // Find Latest version via: https://unpkg.com/open-props
    const [version] = args;
    const baseUrl = `https://unpkg.com/open-props@${version}`;
    const targetDir = options.outPath ?? `css_deps/open-props`;

    await ensureDir(targetDir);
    const openPropsMin = await (await fetch(`${baseUrl}/open-props.min.css`))
      .text();
    await Deno.writeTextFile(
      join(targetDir, "open-props.min.css"),
      openPropsMin,
    );

    const normalize = await (await fetch(`${baseUrl}/normalize.min.css`))
      .text();
    await Deno.writeTextFile(join(targetDir, "normalize.min.css"), normalize);

    const buttons = await (await fetch(`${baseUrl}/buttons.min.css`))
      .text();
    await Deno.writeTextFile(join(targetDir, "buttons.min.css"), buttons);

    // write version file
    await Deno.writeTextFile(join(targetDir, "VERSION"), version);
  })
  .parse(
    Deno.args,
  );
