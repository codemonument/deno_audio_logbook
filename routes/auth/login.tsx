import { HandlerContext, PageProps } from "$fresh/server.ts";
import Layout from "@/components/Layout.tsx";
import TelegramLogin from "../../islands/TelegramLogin.tsx";
import { secretsPromise } from "@/src/utils/secrets.ts";

const secrets = await secretsPromise;
//add_preview_bot_environment
export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  //   // Get cookie from request header and parse it
  //   const maybeAccessToken = getCookies(req.headers)[AUDIO_LOGBOOK_AUTH_COOKIE_NAME];
  //   const db = await dbPromise;

  //   if (maybeAccessToken) {
  //     const maybeUser = await db.selectFrom('audiobook_sessions').where('hash', '=', maybeAccessToken).executeTakeFirst();
  //     const user = UserSession.safeParse(maybeUser);

  //     if (user.success) {
  //       return ctx.render({ user: user.data });
  //     }
  //   }

  return await ctx.render({
    telegramBotUser: secrets.get("TELEGRAM_BOT_USER"),
  });
}

export default function Login(props: PageProps<{ telegramBotUser: string }>) {
  return (
    <Layout h1Override="Audio Logbook - Login">
      <TelegramLogin telegramBotUser={props.data.telegramBotUser} />
    </Layout>
  );
}
