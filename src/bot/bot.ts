import { Bot } from "grammy";
import { secretsPromise } from "@/src/secrets.ts";
import { z } from "zod";
import { s3Promise } from "@/src/s3/s3.ts";

const whitelistedUsers = [
  1722753347, //@Bloodiko
  641861927, //@bjesuiter
];

// Create bot object
/*console.debug(
  `Memory usage before init bot: ${Deno.memoryUsage().rss / 1024}kb`,
);*/
export const botPromise = initBot();

async function initBot() {
  const secrets = await secretsPromise;
  const telegramToken = secrets.get("TELEGRAM_TOKEN");

  const bot = new Bot(z.string().parse(telegramToken));

  // Register Webhook
  await fetch(
    `https://api.telegram.org/bot${telegramToken}/setWebhook?url=https://deno-audio-logbook.deno.dev/bot/${telegramToken}`,
  );

  // Listen for messages
  bot.command("start", (ctx) => ctx.reply("Welcome! Send me a photo!"));
  bot.on("message:voice", async (ctx) => {
    const voice = ctx.message.voice;

    // Extract voice object -  https://core.telegram.org/bots/api#voice

    const userIDSender = ctx.message.from.id;

    if (!whitelistedUsers.includes(userIDSender)) {
      ctx.reply("You are not allowed to upload files!");
      return;
    }

    const s3 = await s3Promise;

    //fetch the file from telegram

    let reply = "Voice file saved successfully!";

    try {
      // Download the voice file via: https://core.telegram.org/bots/api#getfile

      // Get file metadata
      const fileMetadata = await fetch(
        `https://api.telegram.org/bot${telegramToken}/getFile?file_id=${voice.file_id}`,
      );

      const fileMetadataJSON = await fileMetadata.json();
      // Return response object: {ok: true, result: { file_path: "..."}}

      // Download file

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

      const fileName = `${ctx.message.date}.ogg`;

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
    } catch (error) {
      reply = "An Error occured while handling the upload: \n" + error.message;
    }

    ctx.reply(reply);
  });

  return bot;
}

// Not Launch, pass to webhook adapter instead
// bot.start();
