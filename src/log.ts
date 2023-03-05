import * as logBase from "$std/log/mod.ts";

logBase.setup({
  handlers: {
    console: new logBase.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    "deno_audio_logbook": {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

export const log = logBase;
