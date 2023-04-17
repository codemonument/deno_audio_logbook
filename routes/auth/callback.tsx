import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { log } from "axiom";
import { z, ZodError } from "zod";
import { dbPromise } from "@/src/db/db.ts";
import { UserSession } from "@/src/db/db_schema.ts";
import { COOKIE_AUDIO_LOGBOOK_AUTH } from "@/src/const/server_constants.ts";
import { verifyBotAuth } from "@/src/bot/verifyBotAuth.ts";
import type { Theme } from "@/src/types/theme.ts";
import type { ToplevelContext } from "@/src/types/contexts.ts";

export const handler: Handlers<unknown, ToplevelContext> = {
  async GET(req: Request, ctx) {
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
      return ctx.render({ error: payload.error, theme: ctx.state.theme });
    }

    // verify auth date is not too old
    const authDate = new Date(payload.data.unixAuthDate * 1000);
    const now = new Date();
    const authDateDiff = now.getTime() - authDate.getTime();

    if (authDateDiff > 60 * 60 * 1000) {
      const msg = `Auth Date is too old`;

      return new Response(msg, { status: 403 });
    }

    // Verify auth response https://core.telegram.org/widgets/login#checking-authorization
    const dataAuthVerified = await verifyBotAuth(
      url.searchParams,
      payload.data.hash,
    );

    if (!dataAuthVerified) {
      const msg = `Problem while verifying oauth callback payload`;

      return new Response(msg, { status: 403 });
    }

    // store user in db
    const db = await dbPromise;
    await db.insertInto("audiobook_sessions").values(payload.data).execute();

    const response = new Response("", {
      status: 302,
      headers: new Headers([
        ["location", new URL(req.url).origin],
      ]),
    });

    // Cookie Instructions: https://medium.com/deno-the-complete-reference/handling-cookies-in-deno-df42df28d222
    setCookie(response.headers, {
      name: COOKIE_AUDIO_LOGBOOK_AUTH,
      value: payload.data.hash,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    return response;
  },
};

export default function OauthCallbackPage(
  { data }: PageProps<{ error: ZodError; theme: Theme }>,
) {
  return (
    <>
      <h1>Auth Failed {data.error ? "!" : "?"}</h1>
      <pre>{JSON.stringify(data.error, undefined,  ' \t')}</pre>

      <a href="/auth/login">Go back to Login</a>
    </>
  );
}
