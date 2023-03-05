import { HandlerContext, Handlers } from "$fresh/server.ts";
import { log } from "axiom";

export const handler: Handlers = {
  GET(req) {
    const msg = `Received Auth Callback via POST`;
    log.debug(msg, req);
    console.log(msg, req);
    return new Response(msg, { status: 200 });
  },

  POST(req: Request, _ctx: HandlerContext) {
    const msg = `Received Auth Callback via POST`;
    log.debug(msg, req);
    console.log(msg, req);
    return new Response(msg, { status: 200 });
  },
};
