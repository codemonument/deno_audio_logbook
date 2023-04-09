import { HandlerContext, PageProps } from "$fresh/server.ts";
import Layout from "@/components/Layout.tsx";
import { secretsPromise } from "@/src/utils/secrets.ts";
import TelegramLogin from "@/components/TelegramLogin.tsx";
import { Theme } from "@/src/types/theme.ts";
import { getThemeOnServer } from "../../src/utils/getThemeOnServer.ts";

const secrets = await secretsPromise;
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

  const theme = getThemeOnServer(req);

  return await ctx.render({
    telegramBotUser: secrets.get("TELEGRAM_BOT_USER"),
    theme,
  });
}

export default function Login(
  props: PageProps<{ telegramBotUser: string; theme: Theme }>,
) {
  return (
    <Layout h1Override="Audio Logbook - Login" theme={props.data.theme}>
      <TelegramLogin telegramBotUser={props.data.telegramBotUser} />
    </Layout>
  );
}
