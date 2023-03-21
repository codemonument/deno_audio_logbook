import { dbPromise } from "@/src/db/db.ts";

const db = await dbPromise;

const INVALIDATE_TIME_5 = 1000 * 60 * 5;
const INVALIDATE_TIME_1 = 1000 * 60 * 1;
const INVALIDATE_TIME_10 = 1000 * 60 * 10;

type Recording = {
  unixTimestamp: number;
};

type recordings = {
  [userId: number]: {
    unixTimestamp_fetched: number;
    data: Recording[];
  };
};

const DB_CACHE = {
  sessions: {},
  recordings: {} as recordings,
};

export async function getSavedRecordingTimestamps(
  userId: number,
): Promise<Recording[]> {
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
    .execute();

  DB_CACHE.recordings[userId] = {
    unixTimestamp_fetched: Date.now(),
    data: recordings,
  };

  return Promise.resolve(recordings);
}

// TODO: Add a function to get the user session from the DB
