import { Bot } from "grammy";
import { secretsPromise } from '@/src/secrets.ts';
import { z } from "zod";

// Create bot object
export const botPromise = initBot();

async function initBot() {
    const secrets = await secretsPromise;
    const telegramToken = secrets.get('TELEGRAM_TOKEN');

    const bot = new Bot(z.string().parse(telegramToken));

    // Register Webhook
    await fetch(`https://api.telegram.org/bot${telegramToken}/setWebhook?url=https://deno-audio-logbook.deno.dev/bot`);


    // Listen for messages
    bot.command("start", (ctx) => ctx.reply("Welcome! Send me a photo!"));
    bot.on("message:text", (ctx) => ctx.reply("That is text and not a photo!"));
    bot.on("message:photo", (ctx) => ctx.reply("Nice photo! Is that you?"));
    bot.on(
        "edited_message",
        (ctx) =>
            ctx.reply("Ha! Gotcha! You just edited this!", {
                reply_to_message_id: ctx.editedMessage.message_id,
            }),
    );

    return bot;
}


// Not Launch, pass to webhook adapter instead
// bot.start();