import { dbPromise } from "@/src/db/db.ts";

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
    return Promise.resolve(DB_CACHE.recordings[userId].data);
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
  return Promise.resolve(recordings);
}

// TODO: Add a function to get the user session from the DB
