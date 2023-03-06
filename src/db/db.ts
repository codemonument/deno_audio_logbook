import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

import { DbSchema } from "./db_schema.ts";
import { secretsPromise } from "@/src/secrets.ts";
import { log } from "axiom";

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

    log(event): void {
      if (event.level === "query") {
        log.info(`Kysely SQL Command: `, {
          sql: event.query.sql,
          params: event.query.parameters,
        });
        log.flush();
      }
    },
  });

  console.timeEnd("initDb");
  return db;
}
