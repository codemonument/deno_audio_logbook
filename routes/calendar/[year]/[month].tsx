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
import { LogbookDate } from "@/src/calendar/LogbookDate.ts";

// components for the page
import UserInfo from "@/components/UserInfo.tsx";
import Control from "@/components/Control.tsx";

import ThemeSwitcher from "@/islands/ThemeSwitcher.tsx";
import { internalRedirect } from "@/src/utils/redirects.ts";

type HomeProps = PageProps<
  {
    user: UserSession;
    date: LogbookDate;
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

    // Parse correct year and month params from url
    const { year, month } = ctx.params;

    const parsedDate = LogbookDate.safeParse({ month, year });

    // TODO: Query audio files for the selected month

    //  Start rendering with audio and user objects

    // Redirect to date error page when parsing failed
    if (!parsedDate.success) {
      return internalRedirect({
        origin: req.url,
        target: "/errors/date-parsing",
      });
    }

    if (user.success && parsedDate.success) {
      return ctx.render({ user: user.data, date: parsedDate.data });
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

export default function Home({ data }: HomeProps) {
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
        <UserInfo user={data.user} />
      </header>
      <div>
        <Control date={data.date} />
      </div>
      <footer>
        <pre>Deployment: {DEPLOYMENT_ID}</pre>
      </footer>
    </>
  );
}
