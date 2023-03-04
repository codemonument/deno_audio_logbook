import { HandlerContext } from "$fresh/server.ts";
import { webhookCallback } from "grammy";
import { botPromise } from "@/src/bot/bot.ts";

/**
 * The adapter path for the telegram bot
 * 
 * How to use grammy webhooks: 
 * https://grammy.dev/guide/deployment-types.html#how-to-use-webhooks
 */


export const handler = async (_req: Request, ctx: HandlerContext): Promise<Response> => {
    const path = ctx.params.path;

    const bot = await botPromise;
    const result = webhookCallback(bot, "callback");
    console.log(result);

    return new Response(path);
};
