import { Handlers, PageProps } from "$fresh/server.ts";

import { UserSession } from "@/src/db/db_schema.ts";
import { LogbookDate } from "@/src/calendar/LogbookDate.ts";
import { ContextState } from "@/src/context_state.ts";

import { getAudioMetadataForMonth } from "@/src/db/db_queries.ts";

// components for the page
import Control from "@/components/Control.tsx";
import Layout from "@/components/Layout.tsx";

import { gotoInternal } from "@/src/utils/redirects.ts";
import AudioBacklogSidebar from "@/components/AudioBacklogSidebar.tsx";
import LoadSidebar from "@/islands/LoadSidebar.tsx";

type HomeProps = PageProps<
  {
    user: UserSession;
    date: LogbookDate;
    entries: { unixTimestamp: number }[];
  }
>;

/**
 * @requires ctx.state.user => The user session, resolved by the _middleware.ts file
 */
export const handler: Handlers<unknown, ContextState> = {
  async GET(_req, ctx) {
    // Parse correct year and month params from url 
    const { year, month } = ctx.params;
    const parsedDate = LogbookDate.safeParse({ month, year });
    const user = ctx.state.user;

    // Redirect to date error page when parsing failed
    if (!parsedDate.success) {
      return gotoInternal("/errors/date-parsing");
    }

    // DB Queries
    // Query all entries for user for the sidebar (WIP, currently using an api endpoint)
    // const entries = await getSavedRecordingTimestamps(user.userId, "");

    // TODO: Query audio files for the selected month
    const monthAudios = getAudioMetadataForMonth(user.userId, parsedDate.data)

    // Render calendar with audio and user objects
    return ctx.render({ user, date: parsedDate.data });
  },
};

export default function Home({ data }: HomeProps) {
  return (
    <Layout user={data.user}>
      <LoadSidebar />
      <Control date={data.date} />
    </Layout>
  );
}
