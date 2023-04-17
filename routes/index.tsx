import { Handlers } from "$fresh/server.ts";
import { gotoCalendar, gotoLogin } from "@/src/utils/redirects.ts";
import { validateAuth } from "../src/utils/validateAuth.ts";

export const handler: Handlers<unknown, unknown> = {
  async GET(req, _ctx) {
    const userSession = await validateAuth(req);
    if (userSession.isNone()) {
      return gotoLogin();
    }
    return gotoCalendar();
  },
};
