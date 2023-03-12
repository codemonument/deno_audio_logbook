import { HandlerContext, Handlers } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { DEPLOYMENT_ID } from "@/src/server_constants.ts";

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

  return await ctx.render();
}

export default function Login() {
  return (
    <>
      <Head>
        <title>Audio Logbook</title>
      </Head>
      <div>
        <pre>Deno Deployment ID: {DEPLOYMENT_ID}</pre>
        <h1>Audio Logbook - Login</h1>

        <script
          async
          src="https://telegram.org/js/telegram-widget.js?21"
          data-telegram-login="audio_logbook_bot"
          data-size="large"
          data-auth-url="/auth/callback"
          data-request-access="write"
        >
        </script>
      </div>
    </>
  );
}
