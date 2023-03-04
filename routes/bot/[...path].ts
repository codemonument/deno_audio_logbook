import { HandlerContext } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { Status } from "$fresh/server.ts";
import { webhookCallback } from "grammy";
import { botPromise } from "@/src/bot/bot.ts";

/**
 * The adapter path for the telegram bot
 *
 * How to use grammy webhooks:
 * https://grammy.dev/guide/deployment-types.html#how-to-use-webhooks
 */

const bot = await botPromise;
console.debug(
  `Memory usage after init bot: ${Deno.memoryUsage().rss / 1024}kb`,
);
const handleUpdate = webhookCallback(bot, "std/http");

export const handler: Handlers = {
  GET(_req) {
    return new Response("This is a POST-only route");
  },

  async POST(req: Request, ctx: HandlerContext) {
    const path = ctx.params.path;

    if (path !== bot.token) {
      return new Response("You are not authorized to send something here", {
        status: Status.Forbidden,
      });
    }

    try {
      return await handleUpdate(req);
    } catch (err) {
      console.error(err);
      return ctx.renderNotFound();
    }
  },
};