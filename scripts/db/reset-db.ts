import { sql } from "kysely";

import { dbPromise } from "@/src/db/db.ts";
const db = await dbPromise;

await db.schema
  .createTable("audiobook_users")
  .ifNotExists()
  .addColumn("userId", "integer", (col) => col.primaryKey())
  .execute();

const showTables = await sql<void>`SHOW TABLES`.execute(db);

console.log(showTables);

// const truncateUser = sql<void>`TRUNCATE TABLE audiobook_users`;
// const truncateRecordings = sql<void>`TRUNCATE TABLE audiobook_recordings`;

// await truncateUser.execute(db);
// await truncateRecordings.execute(db);

// await db
//   .insertInto("audiobook_users")
//   .values([
//     { userId: 1 },
//   ])
//   .executeTakeFirstOrThrow();

// const result = await db.selectFrom("audiobook_users").selectAll().execute();
// console.log("\n Users: ");
// console.table(result);
