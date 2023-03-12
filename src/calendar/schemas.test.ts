import { LogbookMonth, LogbookYear } from "./schemas.ts";
import { assert, assertThrows } from "$std/testing/asserts.ts";

/**
 * Logbook Month tests
 */
Deno.test(`LogbookMonth should report 1 as 0`, () => {
  const parsedMonth = LogbookMonth.parse("1");
  assert(parsedMonth === 0);
});

Deno.test(`LogbookMonth should use default(=current month) and report correctly without extra subtracting 1 `, () => {
  const parsedMonth = LogbookMonth.parse(undefined);
  assert(parsedMonth === new Date().getMonth());
});

Deno.test(`LogbookMonth parse should throw for input 0`, () => {
  assertThrows(() => LogbookMonth.parse("0"));
});

Deno.test(`LogbookMonth parse should throw for input 13`, () => {
  assertThrows(() => LogbookMonth.parse("13"));
});

/**
 * LogbookYear Tests
 */
Deno.test(`LogbookYear parse should throw for input 1969`, () => {
  assertThrows(() => LogbookYear.parse("1969"));
});

Deno.test(`LogbookYear parse should throw for input 0`, () => {
  assertThrows(() => LogbookYear.parse("0"));
});

Deno.test(`LogbookYear should successfully parse 2370`, () => {
  const parsedYear = LogbookYear.parse("2370");
  assert(parsedYear === 2370);
});

Deno.test(`LogbookYear should use default(=current year) and report correctly as-is `, () => {
  const parsed = LogbookYear.parse(undefined);
  assert(parsed === new Date().getFullYear());
});
