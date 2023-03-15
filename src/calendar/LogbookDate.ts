import { z } from "zod";

export const LogbookDate = z.object({
  // Define LogbookMonth
  month: z.coerce.number().positive().min(1).max(12)
    .default(
      // get current month (already zero indexed)
      // add 1 to not throw off the transform at the end!
      // see schemas.test.ts for the tests!
      new Date().getMonth() + 1,
    )
    .transform(
      // month -1 to get the 0-indexed month, not the string month number
      (val) => val - 1,
    ),

  // Define LogbookYear
  year: z.coerce.number().positive().min(1970).optional()
    .default(
      //get current year
      new Date().getFullYear(),
    ),
});

export type LogbookDate = z.infer<typeof LogbookDate>;
