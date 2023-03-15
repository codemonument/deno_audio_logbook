import { Handlers } from "$fresh/server.ts";
import { gotoCalendar, gotoLogin } from "@/src/utils/redirects.ts";
import { ContextState } from "@/src/context_state.ts";

export const handler: Handlers<unknown, ContextState> = {
  GET(_req, ctx) {
    // This 'if' should be true every time when the code comes here,
    // bc. otherwise we would've been redirected to /auth/login by the _middleware.ts
    if (ctx.state.user) {
      return gotoCalendar();
    }

    return gotoLogin();
  },
};
