import { HandlerContext } from "$fresh/server.ts";

/**
 * The adapter path for the telegram bot
 */

export const handler = (_req: Request, ctx: HandlerContext): Response => {
    const path = ctx.params.path;
    return new Response(path);
};
