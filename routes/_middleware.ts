import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { ToplevelContext } from "@/src/types/contexts.ts";
import { getThemeOnServer } from "@/src/utils/getThemeOnServer.ts";

/**
 * Top-Level Middleware
 * - Loads the user theme into the request context
 * - Initializes the serverOrigin Variable
 *
 * @param req
 * @param ctx
 * @returns
 */
export function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<ToplevelContext>,
) {
  // Initialize serverOrigin
  const origin = new URL(req.url).origin;
  ctx.state.serverOrigin = origin;

  // Initialize theme
  ctx.state.theme = getThemeOnServer(req);

  return ctx.next();
}
