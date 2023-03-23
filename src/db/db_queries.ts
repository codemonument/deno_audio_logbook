import { dbPromise } from "@/src/db/db.ts";
import { UserSession } from "@/src/db/db_schema.ts";

const db = await dbPromise;

const INVALIDATE_TIME_5 = 1000 * 60 * 5;
const INVALIDATE_TIME_1 = 1000 * 60 * 1;
const INVALIDATE_TIME_10 = 1000 * 60 * 10;

enum CACHE_TYPE {
  SESSION = "session",
  RECORDINGS = "recordings",
  AUDIO_PATHS = "audioPaths",
}

type recordings = {
  unixTimestamp_fetched: unixTimestamp_ms;
  data: unixTimestamp_s[];
};
type unixTimestamp_s = number;
type unixTimestamp_ms = number;

type session = {
  unixTimestamp_fetched: unixTimestamp_ms;
  data: UserSession;
};

type audioPathsMonth = {
  unixTimestamp_fetched: unixTimestamp_ms;
  data: path[];
};

type path = string;

type audioPaths = {
  [key: year]: {
    [key: month]: audioPathsMonth;
  };
};

type userId = number;
type year = number;
type month = number;

type DB_CACHE = {
  [key: userId]: {
    [CACHE_TYPE.SESSION]?: session;
    [CACHE_TYPE.RECORDINGS]?: recordings;
    [CACHE_TYPE.AUDIO_PATHS]?: audioPaths;
  };
};

const DB_CACHE: DB_CACHE = {};

function checkCache(
  userId: userId,
  cacheType: CACHE_TYPE,
  month?: month,
  year?: year,
) {
  if (cacheType === CACHE_TYPE.AUDIO_PATHS) {
    if (!month || !year) {
      throw new Error(
        "month and year must be defined for CACHE_TYPE.AUDIO_PATHS",
      );
    }
    if (
      // somehow Typescript needs the ! after the [CACHE_TYPE.AUDIO_PATHS], otherwise it thinks it's undefined even after checking it
      DB_CACHE[userId] &&
      DB_CACHE[userId][CACHE_TYPE.AUDIO_PATHS] &&
      DB_CACHE[userId][CACHE_TYPE.AUDIO_PATHS]![year] &&
      DB_CACHE[userId][CACHE_TYPE.AUDIO_PATHS]![year][month] &&
      Date.now() -
            DB_CACHE[userId][CACHE_TYPE.AUDIO_PATHS]![year][month]
              .unixTimestamp_fetched <
        INVALIDATE_TIME_5
    ) {
      return true;
    }
    return false;
  }

  if (
    DB_CACHE[userId] &&
    DB_CACHE[userId][cacheType] &&
    Date.now() - DB_CACHE[userId][cacheType]!.unixTimestamp_fetched <
      INVALIDATE_TIME_5
  ) {
    return true;
  }
  return false;
}

function writeCache(
  userId: userId,
  cacheType: CACHE_TYPE,
  data: path[] | UserSession | unixTimestamp_s[],
) {
  DB_CACHE[userId] = {
    ...DB_CACHE[userId],
    [cacheType]: {
      unixTimestamp_fetched: Date.now(),
      data,
    },
  };
}

export function invalidateCache(
  userId: number,
  cacheType: CACHE_TYPE,
) {
  //function to invalidate the cache for the given type for the given user.

  switch (cacheType) {
    case CACHE_TYPE.SESSION:
      break;
      //
    case CACHE_TYPE.RECORDINGS:
      DB_CACHE[userId][CACHE_TYPE.RECORDINGS] = {
        unixTimestamp_fetched: 0,
        data: [],
      };

      break;
    case CACHE_TYPE.AUDIO_PATHS:
      break;
      //

    default:
      // do nothing
      break;
  }
}

export async function getSavedRecordingTimestamps(
  userId: number,
  _params: string,
): Promise<number[]> {
  if (checkCache(userId, CACHE_TYPE.RECORDINGS)) {
    console.log("cache hit");
    return DB_CACHE[userId][CACHE_TYPE.RECORDINGS]!.data;
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

  writeCache(userId, CACHE_TYPE.RECORDINGS, recordings);

  // recordings = timestamps of saved recordings
  return recordings;
}

export async function getAudioMetadataForMonth(
  userId: number,
  params: string,
): Promise<string[]> {
  const { year, month } = JSON.parse(params);

  if (!year || !month) {
    throw new Error("year and month must be defined");
  }

  if (checkCache(userId, CACHE_TYPE.AUDIO_PATHS, month, year)) {
    console.log("cache hit");
    return DB_CACHE[userId][CACHE_TYPE.AUDIO_PATHS]![year][month].data;
  }

  const recordings = await db
    .selectFrom("audiobook_recordings")
    .select("filePath")
    .where("userId", "=", userId)
    .where(
      "unixTimestamp",
      ">=",
      Math.floor(new Date(year, month, 1).getTime() / 1000),
    )
    .where(
      "unixTimestamp",
      "<",
      Math.floor(new Date(year, month + 1, 1).getTime() / 1000),
    )
    .execute()
    .then((res) =>
      res.map(
        (r) => r.filePath,
      )
    );
  // recordings = timestamps of saved recordings
  return recordings;
}

// TODO: Add a function to get the user session from the DB
