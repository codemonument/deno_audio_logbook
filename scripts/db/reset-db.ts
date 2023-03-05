import { sql } from "kysely";
import { dbPromise } from "@/src/db/db.ts";

const db = await dbPromise;

await db.schema.dropTable("audiobook_sessions").ifExists().execute();
// await db.schema.dropTable("audiobook_recordings").ifExists().execute();

await db.schema
  .createTable("audiobook_sessions")
  .ifNotExists()
  .addColumn("hash", "integer", (col) => col.primaryKey())
  .addColumn("userId", "integer")
  .addColumn("unixAuthDate", "integer")
  .addColumn("firstName", "varchar(255)")
  .addColumn("lastName", "varchar(255)")
  .addColumn("username", "varchar(255)")
  .addColumn("photoUrl", "varchar(255)")
  .execute();

await db.schema
  .createTable("audiobook_recordings")
  .ifNotExists()
  .addColumn("audioId", "varchar(100)", (col) => col.primaryKey())
  .addColumn("userId", "integer")
  .addColumn("filePath", "varchar(250)")
  .addColumn("mimeType", "varchar(30)")
  .addColumn("unixTimestamp", "integer")
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
