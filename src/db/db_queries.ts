import { dbPromise } from "@/src/db/db.ts";
import { None, Option, Some } from "optionals";
import { UserSession } from "./db_schema.ts";

const db = await dbPromise;

const INVALIDATE_TIME_5 = 1000 * 60 * 5;
const INVALIDATE_TIME_1 = 1000 * 60 * 1;
const INVALIDATE_TIME_10 = 1000 * 60 * 10;

type recordings = {
  [userId: number]: {
    unixTimestamp_fetched: number;
    data: number[];
  };
};

const DB_CACHE = {
  sessions: {},
  recordings: {} as recordings,
};

export function invalidateCache(
  obj: "sessions" | "recordings",
  userId: number,
) {
  //function to invalidate the cache for the given obj for the given user.

  if (obj === "sessions") {
    // todo
  }

  if (obj === "recordings") {
    // todo
  }
}

export async function getSavedRecordingTimestamps(
  userId: number,
): Promise<number[]> {
  if (
    DB_CACHE.recordings[userId]?.data &&
    Date.now() - DB_CACHE.recordings[userId].unixTimestamp_fetched <
      INVALIDATE_TIME_5
  ) {
    return DB_CACHE.recordings[userId].data;
  }

  const recordings = await db
    .selectFrom("audiobook_recordings")
    .select("unixTimestamp")
    .where("userId", "=", userId)
    .execute()
    .then((res) =>
      res.map(
        (r) => r.unixTimestamp,
      )
    );

  DB_CACHE.recordings[userId] = {
    unixTimestamp_fetched: Date.now(),
    data: recordings,
  };
  // recordings = timestamps of saved recordings
  return recordings;
}

// a function to get the user session from the DB
export async function getUserSession(
  accessToken: string,
): Promise<Option<UserSession>> {
  const db = await dbPromise;
  const maybeUserQuery = db
    .selectFrom("audiobook_sessions")
    .selectAll()
    .where(
      "hash",
      "=",
      accessToken,
    );
  const maybeUser = await maybeUserQuery.executeTakeFirst();
  const userParse = UserSession.safeParse(maybeUser);

  if (userParse.success) {
    return Some(userParse.data);
  }
  return None();
}
