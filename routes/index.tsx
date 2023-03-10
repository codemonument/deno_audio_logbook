import { Head } from "$fresh/runtime.ts";
import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  AUDIO_LOGBOOK_AUTH_COOKIE_NAME,
  DEPLOYMENT_ID,
} from "@/src/constants.ts";
import { dbPromise } from "@/src/db/db.ts";
import { UserSession } from "@/src/db/db_schema.ts";
import { secretsPromise } from "@/src/secrets.ts";

// components for the page
import UserInfo from "@/components/UserInfo.tsx";
import Control from "@/components/Control.tsx";

import ThemeSwitcher from "../islands/ThemeSwitcher.tsx";

type HomeProps = PageProps<
  { user: UserSession; date: { month: number; year: number } }
>;

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  // When in dev mode,
  // - get auth token from doppler secrets for local mocking, or
  // - get auth token from request header in anything other than dev mode
  // - and parse it
  const secrets = await secretsPromise;
  const maybeAccessToken = (secrets.get("ENV_NAME") !== "dev")
    ? getCookies(req.headers)[AUDIO_LOGBOOK_AUTH_COOKIE_NAME]
    : secrets.get("MOCK_AUTH_TOKEN");

  if (maybeAccessToken) {
    const db = await dbPromise;
    const maybeUserQuery = db
      .selectFrom("audiobook_sessions")
      .selectAll()
      .where(
        "hash",
        "=",
        maybeAccessToken,
      );
    const maybeUser = await maybeUserQuery.executeTakeFirst();
    const user = UserSession.safeParse(maybeUser);

    if (user.success) {
      //parse url to get month and year
      const url = new URL(req.url);
      const month = parseInt(
        url.searchParams.get("month") || new Date().getMonth().toString(),
      );
      const year = parseInt(
        url.searchParams.get("year") || new Date().getFullYear().toString(),
      );

      return ctx.render({ user: user.data, date: { month, year } });
      // this places the user data in the props of the page: props.data = user.data
    }
  }

  return new Response("", {
    status: 302,
    headers: new Headers(
      [
        ["location", new URL(req.url).origin + "/auth/login"],
      ],
    ),
  });
}

export default function Home(props: HomeProps) {
  const selectedTheme = "light";

  return (
    <>
      <Head>
        <title>Audio Logbook</title>
        <link rel="stylesheet" href="/postcss/global.css" />
      </Head>
      <header>
        <pre>Deno Deployment ID: {DEPLOYMENT_ID}</pre>
        <UserInfo user={props.data.user} />
        <ThemeSwitcher selected={selectedTheme} />
      </header>
      <div>
        <h1>Audio Logbook</h1>

        <Control date={props.data.date} />
      </div>
    </>
  );
}
