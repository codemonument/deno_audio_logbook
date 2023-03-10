// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/auth/callback.tsx";
import * as $1 from "./routes/auth/login.tsx";
import * as $2 from "./routes/bot/[...path].ts";
import * as $3 from "./routes/index.tsx";
import * as $4 from "./routes/postcss/[...path].ts";
import * as $$0 from "./islands/Audio.tsx";
import * as $$1 from "./islands/Counter.tsx";
import * as $$2 from "./islands/DateChanger.tsx";
import * as $$3 from "./islands/ThemeSwitcher.tsx";

const manifest = {
  routes: {
    "./routes/auth/callback.tsx": $0,
    "./routes/auth/login.tsx": $1,
    "./routes/bot/[...path].ts": $2,
    "./routes/index.tsx": $3,
    "./routes/postcss/[...path].ts": $4,
  },
  islands: {
    "./islands/Audio.tsx": $$0,
    "./islands/Counter.tsx": $$1,
    "./islands/DateChanger.tsx": $$2,
    "./islands/ThemeSwitcher.tsx": $$3,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
