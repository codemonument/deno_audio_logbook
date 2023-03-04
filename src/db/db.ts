import {} from "@planetscale/database";

import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

import { DbSchema } from "./db_schema.ts";
import { secretsPromise } from "@/src/secrets.ts";

export const dbPromise: Promise<Kysely<DbSchema>> = initDb();

async function initDb() {
  console.time("initDb");
  const secrets = await secretsPromise;

  const db: Kysely<DbSchema> = new Kysely<DbSchema>({
    dialect: new PlanetScaleDialect({
      host: secrets.get("DATABASE_HOST"),
      username: secrets.get("DATABASE_USERNAME"),
      password: secrets.get("DATABASE_PASSWORD"),
    }),
  });

  console.timeEnd("initDb");
  return db;
}
