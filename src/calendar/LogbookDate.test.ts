import { LogbookDate } from "./LogbookDate.ts";
import { assert, assertThrows } from "$std/testing/asserts.ts";

/**
 * LogbookDate tests
 */
Deno.test(`LogbookDate should return current month and year as default`, () => {
  const parsed = LogbookDate.parse({});
  assert(parsed.month === new Date().getMonth());
  assert(parsed.year === new Date().getFullYear());
});

Deno.test(`LogbookDate should report 1 as 0`, () => {
  const parsed = LogbookDate.parse({
    month: "1",
  });
  assert(parsed.month === 0);
});

Deno.test(`LogbookDate parse should throw for month input 0`, () => {
  assertThrows(() => LogbookDate.parse({ month: "0" }));
});

Deno.test(`LogbookDate parse should throw for month input 13`, () => {
  assertThrows(() => LogbookDate.parse({ month: "13" }));
});

/**
 * LogbookYear Tests
 */
Deno.test(`LogbookDate parse should throw for year input 1969`, () => {
  assertThrows(() => LogbookDate.parse({ year: "1969" }));
});

Deno.test(`LogbookDate parse should throw for year  input 0`, () => {
  assertThrows(() => LogbookDate.parse({ year: "0" }));
});

Deno.test(`LogbookYear should successfully parse 2370`, () => {
  const parsed = LogbookDate.parse({ year: "2370" });
  assert(parsed.year === 2370);
});
