import { Head } from "$fresh/runtime.ts";
import { HandlerContext, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  AUDIO_LOGBOOK_AUTH_COOKIE_NAME,
  DEPLOYMENT_ID,
} from "@/src/server_constants.ts";
import { MONTH_NUMBER_STRING } from "@/src/client_constants.ts";
import { dbPromise } from "@/src/db/db.ts";
import { UserSession } from "@/src/db/db_schema.ts";
import { secretsPromise } from "@/src/secrets.ts";
import { redirectToCalendar, redirectToLogin } from "@/src/utils/redirects.ts";

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
      return redirectToCalendar(req.url);
    }
  }

  return redirectToLogin(req.url);
}

export default function Home() {
  const currentMonth = MONTH_NUMBER_STRING[new Date().getMonth()];
  const currentYear = new Date().getFullYear().toString();

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
        {/* TODO: Put Date Seletor here? */}
        <div class="flex-gap"></div>
        {/* <ThemeSwitcher /> */}
        {/* <UserInfo user={props.data.user} /> */}
      </header>
      <main>
        You should not see this Page. If you do, the redirect to the calendar
        failed.
        <br />
        <a href={`/calendar/${currentYear}/${currentMonth}`}>
          Go to Calendar
        </a>
      </main>
      <footer>
        <pre>Deployment: {DEPLOYMENT_ID}</pre>
      </footer>
    </>
  );
}
