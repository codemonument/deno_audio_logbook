import { Handlers } from "$fresh/server.ts";
import { gotoCalendar, gotoLogin } from "@/src/utils/redirects.ts";
import { ContextState } from "@/src/context_state.ts";
import { validateAuth } from "../src/utils/validateAuth.ts";

export const handler: Handlers<unknown, ContextState> = {
  async GET(_req, ctx) {
    const userSession = await validateAuth(_req);
    if (userSession.isNone()) {
      return gotoLogin();
    }
    return gotoCalendar();
  },
};
