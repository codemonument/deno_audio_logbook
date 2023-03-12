import { Head } from "$fresh/runtime.ts";
import { HandlerContext, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  AUDIO_LOGBOOK_AUTH_COOKIE_NAME,
  DEPLOYMENT_ID,
} from "@/src/server_constants.ts";
import { dbPromise } from "@/src/db/db.ts";
import { UserSession } from "@/src/db/db_schema.ts";
import { secretsPromise } from "@/src/secrets.ts";

// components for the page
import UserInfo from "@/components/UserInfo.tsx";
import Control from "@/components/Control.tsx";

import ThemeSwitcher from "@/islands/ThemeSwitcher.tsx";

type HomeProps = PageProps<
  {
    user: UserSession;
  }
>;

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  // When in dev mode,
  // - get auth token from doppler secrets for local mocking, or
  // - get auth token from request header in anything other than dev mode
  // - and parse it
  const url = new URL(req.url);
  const secrets = await secretsPromise;
  const maybeAccessToken =
    (secrets.get("ENV_NAME") === "dev" || url.host.includes(DEPLOYMENT_ID))
      ? secrets.get("MOCK_AUTH_TOKEN")
      : getCookies(req.headers)[AUDIO_LOGBOOK_AUTH_COOKIE_NAME];

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
      return ctx.render({ user: user.data });
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
  // OPTIONAL: Maybe move this to a function, and check it in the handler, to correctly redirect to the current month if the date is invalid
  const { year, month } = props.params;

  const date = { year: parseInt(year), month: parseInt(month) - 1 }; // month -1 to get the 0-indexed month, not the string month number

  if (date.year < 1970 || (date.month < 0 || date.month > 11)) {
    date.year = new Date().getFullYear();
    date.month = new Date().getMonth();
  }

  return (
    <>
      <Head>
        <title>Audio Logbook</title>
        <link rel="stylesheet" href="/reset.css" />
        <link rel="stylesheet" href="/postcss/global.css" />
      </Head>
      <header>
        <h1>Audio Logbook</h1>
        <div class="flex-gap"></div>
        <ThemeSwitcher />
        <UserInfo user={props.data.user} />
      </header>
      <div>
        <Control date={date} />
      </div>
      <footer>
        <pre>Deployment: {DEPLOYMENT_ID}</pre>
      </footer>
    </>
  );
}
