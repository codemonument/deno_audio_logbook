import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { log } from "axiom";
import { z, ZodError } from "zod";
import { dbPromise } from "@/src/db/db.ts";
import { UserSession } from "@/src/db/db_schema.ts";
import { AUDIO_LOGBOOK_AUTH_COOKIE_NAME } from "@/src/server_constants.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx: HandlerContext) {
    const msg = `Received Auth Callback via GET`;
    // log.debug(msg, req);
    // log.flush();
    console.log(msg, req);

    /**
     * Extract Telegram Sign On Data
     */
    const url = new URL(req.url);

    const payload = UserSession.safeParse({
      hash: url.searchParams.get("hash"),
      userId: url.searchParams.get("id"),
      unixAuthDate: url.searchParams.get("auth_date"),
      username: url.searchParams.get("username"),
      firstName: url.searchParams.get("first_name"),
      lastName: url.searchParams.get("last_name"),
      photoUrl: url.searchParams.get("photo_url"),
    });

    if (!payload.success) {
      const msg = `Problem while parsing oauth callback payload`;
      console.error(msg, payload);
      // log.error(msg, payload.error);
      // await log.flush();
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

    // Cookie Instructions: https://medium.com/deno-the-complete-reference/handling-cookies-in-deno-df42df28d222
    setCookie(response.headers, {
      name: AUDIO_LOGBOOK_AUTH_COOKIE_NAME,
      value: payload.data.hash,
      path: "/",
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

export default function OauthCallbackPage(
  { data: error }: PageProps<ZodError>,
) {
  return (
    <>
      <h1>Auth Failed {error ? "!" : "?"}</h1>
      <pre>{JSON.stringify(error, undefined,  ' \t')}</pre>

      <a href="/auth/login">Go back to Login</a>
    </>
  );
}
