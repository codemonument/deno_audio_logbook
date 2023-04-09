import { secretsPromise } from "./secrets.ts";
import {
  COOKIE_AUDIO_LOGBOOK_AUTH,
  DEPLOYMENT_ID,
} from "@/src/const/server_constants.ts";

import { getCookies } from "$std/http/cookie.ts";
import { getUserSession } from "@/src/db/db_queries.ts";
import { None } from "optionals";
import { UserSession } from "@/src/db/db_schema.ts";

const secrets = await secretsPromise;

export async function validateAuth(req: Request) {
  // When in dev mode,
  // - get auth token from doppler secrets for local mocking, or
  // - get auth token from request header in anything other than dev mode
  // - and parse it
  const url = new URL(req.url);

  const maybeAccessToken =
    (secrets.get("ENV_NAME") === "dev" || url.host.includes(DEPLOYMENT_ID))
      ? secrets.get("MOCK_AUTH_TOKEN")
      : getCookies(req.headers)[COOKIE_AUDIO_LOGBOOK_AUTH]; //return undefined if no cookie is set

  if (!maybeAccessToken) {
    return None<UserSession>();
  }
  const userSession = await getUserSession(maybeAccessToken);

  return userSession;
}
