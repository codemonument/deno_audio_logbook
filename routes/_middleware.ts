import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { serverOrigin } from "@/src/const/server_constants.ts";

let originInitialized = false;

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<void>,
) {
  if (!originInitialized) {
    const origin = new URL(req.url).origin;
    serverOrigin.resolve(origin);
    originInitialized = true;
  }

  const resp = await ctx.next();
  return resp;
}
