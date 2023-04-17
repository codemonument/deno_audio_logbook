import type { Theme } from "@/src/types/theme.ts";
import type { UserSession } from "@/src/db/db_schema.ts";

/**
 * This is the top-level context, created in @/src/routes/_middleware.ts
 */
export type ToplevelContext = {
  serverOrigin: string;
  theme: Theme;
};

/**
 * This is the context created in  @/src/routes/userarea/_middleware.ts
 */
export type UserareaContext = ToplevelContext & {
  user: UserSession;
};
