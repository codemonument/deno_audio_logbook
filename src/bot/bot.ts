import { Bot } from "grammy";
import { secretsPromise } from "@/src/utils/secrets.ts";
import { z } from "zod";
import { s3Promise } from "@/src/s3/s3.ts";
import { log } from "axiom";
import { isUserAuthorized } from "./is-user-authorized.ts";
import { dbPromise } from "@/src/db/db.ts";
import { invalidateCache } from "@/src/db/db_queries.ts";
import { UserSession } from "@/src/db/db_schema.ts";
import { CACHE_TYPE } from "@/src/const/server_constants.ts";

// Resolve async dependencies
const secrets = await secretsPromise;

// Create bot object
export const botPromise = initBot();

/**
 * Telegram API Guide for Bots:
 * https://core.telegram.org/bots/api
 *
 * In-Depth guide for avoiding problems with webhook based telegram bots:
 * https://core.telegram.org/bots/webhooks
 *
 * TODO: Read and follow!
 */
async function initBot() {
  const telegramToken = secrets.get("TELEGRAM_TOKEN");
  const bot = new Bot(z.string().parse(telegramToken));
  const botUser = secrets.get("TELEGRAM_BOT_USER");

  let botWebhookUrl =
    `https://deno-audio-logbook.deno.dev/bot/${telegramToken}`;
  if (botUser?.includes("preview")) {
    botWebhookUrl =
      `https://deno-audio-logbook-preview.deno.dev/bot/${telegramToken}`;
  }

  // Register the Bot's Webhook at telegram, based on the bots name
  await fetch(
    `https://api.telegram.org/bot${telegramToken}/setWebhook?url=${botWebhookUrl}`,
  );

  // Listen for messages
  bot.command("start", (ctx) => {
    ctx.reply("Welcome! Send me a voice message!");
  });

  bot.on("message:voice", async (ctx) => {
    const userIDSender = ctx.message.from.id;
    if (!isUserAuthorized(userIDSender)) {
      ctx.reply("You don't have permission to use the BOT!");
      return;
    }

    // Extract voice object -  https://core.telegram.org/bots/api#voice
    const voice = ctx.message.voice;

    const s3 = await s3Promise;

    // fetch the file from telegram
    let reply = "Voice file saved successfully!";

    try {
      // Get file metadata from https://core.telegram.org/bots/api#getfile
      const fileMetadata = await fetch(
        `https://api.telegram.org/bot${telegramToken}/getFile?file_id=${voice.file_id}`,
      );

      const fileMetadataJSON = await fileMetadata.json();
      // Return response object: {ok: true, result: { file_path: "..."}}

      // Fetch the file
      const file = await fetch(
        `https://api.telegram.org/file/bot${telegramToken}/${fileMetadataJSON.result.file_path}`,
      );

      if (file.body === null) {
        throw new Error(
          "File download unsuccessful. File body is null. Please send 500$ to devs to resolve this issue.",
        );
      }

      //   console.log("FilePath: " + fileMetadataJSON.result.file_path);
      //   console.log("FilePath_noResult: " + fileMetadataJSON.file_path);

      //   console.log("Fileheader length: " + file.headers.get("Content-Length"));
      //   console.log("Metadata length: " + fileMetadataJSON.file_size);
      //   console.log("Voice length: " + voice.file_size);

      //   console.log("MetadataJSON: " + JSON.stringify(fileMetadataJSON));

      //   console.log("File Return Code: " + file.status);

      const fileName = `${ctx.message.date}${
        voice.mime_type === "audio/ogg" ? ".ogg" : ""
      }`;

      // Upload to S3
      await s3.putObject(
        `${userIDSender}/${fileName}`,
        file.body,
        {
          metadata: {
            "Content-Type": z.string().parse(voice.mime_type),
          },
          //   size: fileMetadataJSON.result.file_size, // DONT use size if readable stream is used
          partSize: 20 * 1024 * 1024,
        },
      );

      // if no error occured until now, add the file to the database
      const db = await dbPromise;

      await db.insertInto("audiobook_recordings")
        .values(
          {
            userId: userIDSender,
            filePath: `${userIDSender}/${fileName}`,
            audioId: voice.file_id,
            mimeType: z.string().parse(voice.mime_type),
            unixTimestamp: ctx.message.date,
          },
        )
        .execute();
    } catch (error) {
      reply = "An Error occured while handling the upload: \n" + error.message;
    }

    // invalidate recordings cache for this user
    invalidateCache(userIDSender, CACHE_TYPE.RECORDINGS);

    // invalidate audio paths cache for this user
    invalidateCache(userIDSender, CACHE_TYPE.AUDIO_META);

    ctx.reply(reply);
  });

  return bot;
}

// Not Launch, pass to webhook adapter instead
// bot.start();
