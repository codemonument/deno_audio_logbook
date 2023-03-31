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
  AUDIO_META = "audioMeta",
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
    [CACHE_TYPE.SESSION]?: session; // contains the full user session object
    [CACHE_TYPE.RECORDINGS]?: recordings;
    [CACHE_TYPE.AUDIO_META]?: audioMeta;
  };
};

type accessToken = string;
type reverseMatchTokenToUserId = {
  [key: accessToken]: {
    userId: userId;
    unixTimestamp_fetched: unixTimestamp_ms;
  };
};

const DB_CACHE: DB_CACHE = {};

const TOKEN_USERID: reverseMatchTokenToUserId = {};

function isInvalid(
  unixTimestamp_fetched: unixTimestamp_ms,
  invalidateTime: number,
) {
  return Date.now() - unixTimestamp_fetched > invalidateTime;
}

function checkCache(
  userId: userId,
  cacheType: CACHE_TYPE,
  month?: month,
  year?: year,
) {
  if (cacheType === CACHE_TYPE.AUDIO_META) {
    if (!month || !year) {
      throw new Error(
        "month and year must be defined for CACHE_TYPE.AUDIO_META",
      );
    }
    if (
      // somehow Typescript needs the ! after the [CACHE_TYPE.AUDIO_PATHS], otherwise it thinks it's undefined even after checking it
      DB_CACHE[userId] &&
      DB_CACHE[userId][CACHE_TYPE.AUDIO_META] &&
      DB_CACHE[userId][CACHE_TYPE.AUDIO_META]![year] &&
      DB_CACHE[userId][CACHE_TYPE.AUDIO_META]![year][month] &&
      !isInvalid(
        DB_CACHE[userId][CACHE_TYPE.AUDIO_META]![year][month]!
          .unixTimestamp_fetched,
        INVALIDATE_TIME_5,
      )
    ) {
      return true;
    }
    return false;
  }

  if (
    DB_CACHE[userId] &&
    DB_CACHE[userId][cacheType] &&
    !isInvalid(
      DB_CACHE[userId][cacheType]!.unixTimestamp_fetched,
      INVALIDATE_TIME_5,
    )
  ) {
    return true;
  }
  return false;
}

type writeCacheParams_Session = {
  userId: userId;
  cacheType: CACHE_TYPE.SESSION;
  data: UserSession;
};

type writeCacheParams_Recordings = {
  userId: userId;
  cacheType: CACHE_TYPE.RECORDINGS;
  data: unixTimestamp_s[];
};

type writeCacheParams_AudioMeta = {
  userId: userId;
  cacheType: CACHE_TYPE.AUDIO_META;
  data: audioMeta;
};

type writeCacheParams =
  | writeCacheParams_Session
  | writeCacheParams_Recordings
  | writeCacheParams_AudioMeta;

function writeCache({ userId, cacheType, data }: writeCacheParams) {
  if (!DB_CACHE[userId]) {
    DB_CACHE[userId] = {};
  }

  if (!DB_CACHE[userId][cacheType]) {
    DB_CACHE[userId][cacheType] = {} as any;
  }

  if (cacheType === CACHE_TYPE.AUDIO_META) {
    const year = parseInt(Object.keys(data)[0]);
    const month = parseInt(Object.keys(data[year])[0]);

    if (!DB_CACHE[userId][cacheType]![year]) {
      DB_CACHE[userId][cacheType]![year] = {};
    }

    DB_CACHE[userId][cacheType]![year] = {
      ...DB_CACHE[userId][cacheType]![year],
      [month]: data[year][month],
    };
  }

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
    console.log("cache hit for recordings");
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

  writeCache({ userId, cacheType: CACHE_TYPE.RECORDINGS, data: recordings });

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

  const fileMeta = await queryAudioMeta(userId, year, month);
  const audioMeta = {
    [year]: {
      [month]: {
        unixTimestamp_fetched: Date.now(),
        data: fileMeta,
      },
    },
  };
  writeCache({ userId, cacheType: CACHE_TYPE.AUDIO_META, data: audioMeta });

  return fileMeta;
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
  if (
    TOKEN_USERID[accessToken] &&
    !isInvalid(
      TOKEN_USERID[accessToken].unixTimestamp_fetched,
      INVALIDATE_TIME_1,
    )
  ) {
    const userId = TOKEN_USERID[accessToken].userId;
    if (checkCache(userId, CACHE_TYPE.SESSION)) {
      console.log("cache hit SESSION");
      return Some(DB_CACHE[userId][CACHE_TYPE.SESSION]!.data);
    }
  }

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
    writeCache({
      userId: userParse.data.userId,
      cacheType: CACHE_TYPE.SESSION,
      data: userParse.data,
    });
    TOKEN_USERID[accessToken] = {
      userId: userParse.data.userId,
      unixTimestamp_fetched: Date.now(),
    };
    return Some(userParse.data);
  }
  return None();
}
