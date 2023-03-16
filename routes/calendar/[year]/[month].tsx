import { Handlers, PageProps } from "$fresh/server.ts";

import { UserSession } from "@/src/db/db_schema.ts";
import { LogbookDate } from "@/src/calendar/LogbookDate.ts";
import { ContextState } from "@/src/context_state.ts";

// components for the page
import Control from "@/components/Control.tsx";
import Layout from "@/components/Layout.tsx";

import { gotoInternal } from "@/src/utils/redirects.ts";

type HomeProps = PageProps<
  {
    user: UserSession;
    date: LogbookDate;
  }
>;

/**
 * @requires ctx.state.user => The user session, resolved by the _middleware.ts file
 */
export const handler: Handlers<unknown, ContextState> = {
  GET(_req, ctx) {
    // Parse correct year and month params from url
    const { year, month } = ctx.params;
    const parsedDate = LogbookDate.safeParse({ month, year });
    const user = ctx.state.user;

    // TODO: Query audio files for the selected month

    // Redirect to date error page when parsing failed
    if (!parsedDate.success) {
      return gotoInternal("/errors/date-parsing");
    }

    // Render calendar with audio and user objects
    return ctx.render({ user, date: parsedDate.data });
  },
};

export default function Home({ data }: HomeProps) {
  return (
    <Layout user={data.user}>
      <Control date={data.date} />
    </Layout>
  );
}
