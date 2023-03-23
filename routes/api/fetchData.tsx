import { Handlers } from "$fresh/server.ts";
import { gotoCalendar, gotoLogin } from "@/src/utils/redirects.ts";
import { ContextState } from "@/src/context_state.ts";

import { getSavedRecordingTimestamps } from "@/src/db/db_queries.ts";

type FetchDataMap = {
  [key: string]: (userId: number) => Promise<unknown>;
};

const FetchData: FetchDataMap = {
  sidebar: getSavedRecordingTimestamps,
};

export const handler: Handlers<unknown, ContextState> = {
  /**
   * @requires ctx.state.user
   */
  async GET(_req, ctx) {
    // This 'if' should be true every time when the code comes here,
    // bc. otherwise we would've been redirected to /auth/login by the _middleware.ts
    if (ctx.state.user) {
      const url = new URL(_req.url);
      const whichData = url.searchParams.get("whichData");
      if (whichData) {
        const data = await FetchData[whichData](ctx.state.user.userId);
        return new Response(JSON.stringify(data), { status: 200 });
      }
      return new Response(
        `No 'whichData' parameter provided, ${url}, ${_req.url}`,
        { status: 400 },
      );
    }

    return gotoLogin();
  },
};
