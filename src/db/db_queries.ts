import { dbPromise } from "@/src/db/db.ts";
import { None, Option, Some } from "optionals";
import { UserSession } from "./db_schema.ts";
import { LogbookDate } from "@/src/calendar/LogbookDate.ts";

const db = await dbPromise;

const INVALIDATE_TIME_5 = 1000 * 60 * 5;
const INVALIDATE_TIME_1 = 1000 * 60 * 1;
const INVALIDATE_TIME_10 = 1000 * 60 * 10;

enum CACHE_TYPE {
  SESSION = "session",
  RECORDINGS = "recordings",
  AUDIO_META = "audioPaths",
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

type audioMetaMonth = {
  unixTimestamp_fetched: unixTimestamp_ms;
  data: Awaited<ReturnType<typeof queryAudioMeta>>;
};

type path = string;

type audioMeta = {
  [key: year]: {
    [key: month]: audioMetaMonth;
  };
};

type userId = number;
type year = number;
type month = number;

type DB_CACHE = {
  [key: userId]: {
    [CACHE_TYPE.SESSION]?: session;
    [CACHE_TYPE.RECORDINGS]?: recordings;
    [CACHE_TYPE.AUDIO_META]?: audioMeta;
  };
};

const DB_CACHE: DB_CACHE = {};

function checkCache(
  userId: userId,
  cacheType: CACHE_TYPE,
  month?: month,
  year?: year,
) {
  if (cacheType === CACHE_TYPE.AUDIO_META) {
    if (!month || !year) {
      throw new Error(
        "month and year must be defined for CACHE_TYPE.AUDIO_PATHS",
      );
    }
    if (
      // somehow Typescript needs the ! after the [CACHE_TYPE.AUDIO_PATHS], otherwise it thinks it's undefined even after checking it
      DB_CACHE[userId] &&
      DB_CACHE[userId][CACHE_TYPE.AUDIO_META] &&
      DB_CACHE[userId][CACHE_TYPE.AUDIO_META]![year] &&
      DB_CACHE[userId][CACHE_TYPE.AUDIO_META]![year][month] &&
      Date.now() -
            DB_CACHE[userId][CACHE_TYPE.AUDIO_META]![year][month]
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
  data: audioMeta[] | UserSession | unixTimestamp_s[],
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
    case CACHE_TYPE.AUDIO_META:
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
  date: LogbookDate,
) {
  const { month, year } = date;

  if (checkCache(userId, CACHE_TYPE.AUDIO_META, month, year)) {
    console.log(`cache hit for ${CACHE_TYPE.AUDIO_META}`);
    return DB_CACHE[userId][CACHE_TYPE.AUDIO_META]![year][month].data;
  }

  const recordings = await queryAudioMeta(userId, year, month);
  writeCache(userId, CACHE_TYPE.AUDIO_META, recordings);

  return recordings;
}

async function queryAudioMeta(userId: number, year: number, month: number) {
  const recordings = await db
    .selectFrom("audiobook_recordings")
    .select(["filePath", "unixTimestamp"])
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
    .execute();
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
