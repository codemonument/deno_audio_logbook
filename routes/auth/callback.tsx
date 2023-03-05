import { HandlerContext, Handlers } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { log } from "axiom";
import { z } from "zod";
import { dbPromise } from "@/src/db/db.ts";
import { UserSession } from "@/src/db/db_schema.ts";
import { AUDIO_LOGBOOK_AUTH_COOKIE_NAME } from "@/src/constants.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext) {
    /**
     * Extract Telegram Sign On Data
     */
    const url = new URL(req.url);

    const payload = UserSession.safeParse({
      hash: url.searchParams.get("hash"),
      userId: url.searchParams.get("id"),
      unixAuthDate: url.searchParams.get("auth_date"),
      firstName: url.searchParams.get("first_name"),
      lastName: url.searchParams.get("last_name"),
      username: url.searchParams.get("username"),
      photoUrl: url.searchParams.get("photo_url"),
    });

    if (!payload.success) {
      const msg = `Problem while parsing oauth callback payload`; 
      log.error(msg, payload.error);
      console.error(msg, payload.error);
      await log.flush();
      return ctx.render(payload.error);
    }

    // TODO: Verify auth response https://core.telegram.org/widgets/login#checking-authorization

    // store user in db
    const db = await dbPromise;
    await db.insertInto("audiobook_sessions").values(payload.data).execute();

    // TODO: generate user login cookie
    const response = new Response("", {
      status: 302,
      headers: new Headers([
        ["location", new URL(req.url).origin],
      ]),
    });

    setCookie(response.headers, {
      name: AUDIO_LOGBOOK_AUTH_COOKIE_NAME,
      value: payload.data.hash,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    return response;

    // const msg = `Received Auth Callback via POST`;
    // log.debug(msg, req);
    // log.flush();
    // console.log(msg, req);
    // return new Response(msg, { status: 200 });
  },
};

export default function OauthCallbackPage({ error }: { error: Error }) {
  return (
    <>
      <h1>Oauth Failed?</h1>

      <p>Has Error: {!!error}</p>

      <pre>{JSON.stringify(error, undefined,  ' \t')}</pre>

      <a href="/auth/login">Go back to Login</a>
    </>
  );
}
