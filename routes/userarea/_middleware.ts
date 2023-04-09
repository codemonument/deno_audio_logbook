import { MiddlewareHandlerContext } from "$fresh/server.ts";

import { gotoLogin } from "@/src/utils/redirects.ts";
import { ContextState } from "@/src/context_state.ts";
import { validateAuth } from "@/src/utils/validateAuth.ts";
import { getThemeOnServer } from "@/src/utils/getThemeOnServer.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<ContextState>,
) {
  // Initialize serverOrigin deferred promise
  const origin = new URL(req.url).origin;
  ctx.state.serverOrigin = origin;

  const userSession = await validateAuth(req);

  // Redirect to login page when UserSession is not available
  if (userSession.isNone()) {
    return gotoLogin();
  }

  // Happy Path to the normal App
  ctx.state.user = userSession.unwrap();
  ctx.state.theme = getThemeOnServer(req)
  return ctx.next();
}
