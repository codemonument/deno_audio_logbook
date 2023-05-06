/**
 * Configures postcss with openprops
 */

import * as log from "$std/log/mod.ts";
import { generatePostcssHandler, prefillCssCache } from "fresh-openprops";
import { IS_SERVER } from "@/src/const/server_constants.ts";

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

export const handler = await generatePostcssHandler({
  isProd: IS_SERVER,
});

await prefillCssCache();
