import { HandlerContext, Handlers } from "$fresh/server.ts";
import { log } from "axiom";
import { z } from "zod";
import { dbPromise } from "@/src/db/db.ts";
import { SessionTable } from "@/src/db/db_schema.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext) {
    /**
     * Extract Telegram Sign On Data
     */
    const url = new URL(req.url);

    const payload = SessionTable.safeParse({
      hash: url.searchParams.get("hash"),
      userId: url.searchParams.get("id"),
      unixAuthDate: url.searchParams.get("auth_date"),
      firstName: url.searchParams.get("first_name"),
      lastName: url.searchParams.get("last_name"),
      username: url.searchParams.get("username"),
      photoUrl: url.searchParams.get("photo_url"),
    });

    if (!payload.success) {
      return ctx.render(false);
    }

    // TODO: Verify auth response https://core.telegram.org/widgets/login#checking-authorization

    // store user in db
    const db = await dbPromise;
    await db.insertInto("audiobook_sessions").values(payload.data).execute();

    // TODO: generate user login cookie

    const msg = `Received Auth Callback via POST`;
    log.debug(msg, req);
    log.flush();
    console.log(msg, req);
    return new Response(msg, { status: 200 });
  },
};
