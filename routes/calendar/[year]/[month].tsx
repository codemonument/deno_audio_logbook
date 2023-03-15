import { HandlerContext, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  AUDIO_LOGBOOK_AUTH_COOKIE_NAME,
  DEPLOYMENT_ID,
} from "@/src/const/server_constants.ts";
import { dbPromise } from "@/src/db/db.ts";
import { UserSession } from "@/src/db/db_schema.ts";
import { secretsPromise } from "@/src/secrets.ts";
import { LogbookDate } from "@/src/calendar/LogbookDate.ts";

// components for the page
import Control from "@/components/Control.tsx";
import Layout from "@/components/Layout.tsx";

import { gotoInternal, gotoLogin } from "@/src/utils/redirects.ts";

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
      return gotoInternal("/errors/date-parsing");
    }

    if (user.success && parsedDate.success) {
      return ctx.render({ user: user.data, date: parsedDate.data });
    }
  }

  return gotoLogin();
}

export default function Home({ data }: HomeProps) {
  return (
    <Layout user={data.user}>
      <Control date={data.date} />
    </Layout>
  );
}
