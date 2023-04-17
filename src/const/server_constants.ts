export const COOKIE_AUDIO_LOGBOOK_AUTH = "audio_logbook_auth";

export const DEPLOYMENT_ID = Deno.env.get("DENO_DEPLOYMENT_ID") ??
  "unknown/unavailable";

export const IS_SERVER = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

export enum CACHE_TYPE {
  SESSION = "session",
  RECORDINGS = "recordings",
  AUDIO_META = "audioMeta",
}
