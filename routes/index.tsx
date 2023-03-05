import { Head } from "$fresh/runtime.ts";
import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  AUDIO_LOGBOOK_AUTH_COOKIE_NAME,
  DEPLOYMENT_ID,
} from "@/src/constants.ts";
import { dbPromise } from "@/src/db/db.ts";
import { UserSession } from "@/src/db/db_schema.ts";

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  // Get cookie from request header and parse it
  const maybeAccessToken =
    getCookies(req.headers)[AUDIO_LOGBOOK_AUTH_COOKIE_NAME];

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
      return ctx.render(user.data);
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

export default function Home({ data: user }: PageProps<UserSession>) {
  return (
    <>
      <Head>
        <title>Audio Logbook</title>
      </Head>
      <div>
        <pre>Deno Deployment ID: {DEPLOYMENT_ID}</pre>
        <h1>Audio Logbook</h1>

        <p>
          <b>Hello, {user?.firstName} {user?.lastName}!</b>
          <img src={user?.photoUrl}></img>
        </p>

        <ul>
          <li>{user?.username}</li>
          <li>{user?.unixAuthDate}</li>
        </ul>
      </div>
    </>
  );
}
