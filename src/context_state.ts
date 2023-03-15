import type { UserSession } from "./db/db_schema.ts";

export type ContextState = {
  user: UserSession;
};
