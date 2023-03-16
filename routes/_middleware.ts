import { MiddlewareHandlerContext } from "$fresh/server.ts";
import {
  AUDIO_LOGBOOK_AUTH_COOKIE_NAME,
  DEPLOYMENT_ID,
  serverOrigin,
} from "@/src/const/server_constants.ts";
import { UserSession } from "@/src/db/db_schema.ts";
import { secretsPromise } from "@/src/utils/secrets.ts";
import { getCookies } from "$std/http/cookie.ts";
import { dbPromise } from "@/src/db/db.ts";
import { gotoLogin } from "@/src/utils/redirects.ts";
import { ContextState } from "@/src/context_state.ts";

let originInitialized = false;

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<ContextState>,
) {
  // Initialize serverOrigin deferred promise
  if (!originInitialized) {
    const origin = new URL(req.url).origin;
    serverOrigin.resolve(origin);
    originInitialized = true;
  }

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
    const userParse = UserSession.safeParse(maybeUser);

    // If user is on the login page, do not redirect to login (bc.this would be endless loop)
    if (new URL(req.url).pathname.startsWith(`/auth/login`)) {
      return ctx.next();
    }

    // Redirect to login page when no UserSession is not available
    if (!userParse.success) {
      return gotoLogin();
    }

    // Happy Path to the normal App
    ctx.state.user = userParse.data;
    return ctx.next();
  }
}
