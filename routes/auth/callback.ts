import { HandlerContext, Handlers } from "$fresh/server.ts";
import { log } from "axiom";

export const handler: Handlers = {
  GET(req) {
    log.debug(`Received Auth Callback via GET: `, req);
    console.log(`Received Auth Callback via GET: `, req);

    return new Response("", { status: 200 });
  },

  POST(req: Request, _ctx: HandlerContext) {
    log.debug(`Received Auth Callback via GET: `, req);
    console.log(`Received Auth Callback via GET: `, req);
    return new Response("", { status: 200 });
  },
};
