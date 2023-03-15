import { Handlers } from "$fresh/server.ts";
import { gotoCalendar, gotoLogin } from "@/src/utils/redirects.ts";
import type { RootMiddlewareState } from "./_middleware.ts";

export const handler: Handlers<unknown, RootMiddlewareState> = {
  GET(_req, ctx) {
    if (ctx.state.user) {
      return gotoCalendar();
    }

    return gotoLogin();
  },
};
