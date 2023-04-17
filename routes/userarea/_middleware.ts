import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { UserareaContext } from "@/src/types/contexts.ts";
import { gotoLogin } from "@/src/utils/redirects.ts";
import { validateAuth } from "@/src/utils/validateAuth.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<UserareaContext>,
) {
  // Initialize UserSession inside Context
  const userSession = await validateAuth(req);

  // Redirect to login page when UserSession is not available
  if (userSession.isNone()) {
    return gotoLogin();
  }

  // Happy Path to the normal App
  ctx.state.user = userSession.unwrap();
  return ctx.next();
}
