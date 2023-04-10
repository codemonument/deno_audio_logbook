import { HandlerContext, PageProps } from "$fresh/server.ts";
import { secretsPromise } from "@/src/utils/secrets.ts";
import Layout from "@/components/Layout.tsx";
import TelegramLogin from "@/components/TelegramLogin.tsx";
import type { ToplevelContext } from "@/src/types/contexts.ts";
import type { Theme } from "@/src/types/theme.ts";

const secrets = await secretsPromise;

export async function handler(
  req: Request,
  ctx: HandlerContext<unknown, ToplevelContext>,
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
    theme: ctx.state.theme,
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
