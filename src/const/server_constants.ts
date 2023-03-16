export const AUDIO_LOGBOOK_AUTH_COOKIE_NAME = "audio_logbook_auth";
export const DEPLOYMENT_ID = Deno.env.get("DENO_DEPLOYMENT_ID") ??
  "unknown/unavailable";
