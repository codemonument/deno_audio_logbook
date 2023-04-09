import type { UserSession } from "./db/db_schema.ts";
import { Theme } from "@/src/types/theme.ts";

export type ContextState = {
  theme: Theme;
  user: UserSession;
  serverOrigin: string;
};
