import { Handlers, PageProps } from "$fresh/server.ts";

import { UserSession } from "@/src/db/db_schema.ts";
import { LogbookDate } from "@/src/calendar/LogbookDate.ts";

import { getAudioMetadataForMonth } from "@/src/db/db_queries.ts";

// components for the page
import Control from "@/components/Control.tsx";
import type { Audio } from "@/components/Day.tsx";
import Layout from "@/components/Layout.tsx";

import { gotoInternal } from "@/src/utils/redirects.ts";
import AudioBacklogSidebar from "@/components/AudioBacklogSidebar.tsx";
import LoadSidebar from "@/islands/LoadSidebar.tsx";
import { s3Promise } from "@/src/s3/s3.ts";
import { Theme } from "@/src/types/theme.ts";
import { UserareaContext } from "@/src/types/contexts.ts";

type HomeProps = PageProps<
  {
    user: UserSession;
    date: LogbookDate;
    monthAudios: Audio[];
    theme: Theme;
  }
>;

const s3 = await s3Promise;

/**
 * @requires ctx.state.user => The user session, resolved by the _middleware.ts file
 */
export const handler: Handlers<unknown, UserareaContext> = {
  async GET(_req, ctx) {
    // Parse correct year and month params from url
    const { year, month } = ctx.params;
    const parsedDate = LogbookDate.safeParse({ month, year });
    const user = ctx.state.user;

    // Redirect to date error page when parsing failed
    if (!parsedDate.success) {
      return gotoInternal("/userarea/errors/date-parsing");
    }

    // DB Queries
    // Query all entries for user for the sidebar (WIP, currently using an api endpoint)
    // const entries = await getSavedRecordingTimestamps(user.userId, "");

    // TODO: Query audio files for the selected month
    const monthAudiosMeta = await getAudioMetadataForMonth(
      user.userId,
      parsedDate.data,
    );

    const monthAudiosPromises = monthAudiosMeta.map(async (audioMeta) => {
      const presignedUrl = await s3.getPresignedUrl("GET", audioMeta.filePath);
      return {
        ...audioMeta,
        url: presignedUrl,
      };
    });

    const monthAudios = await Promise.all(monthAudiosPromises);

    // Render calendar with audio and user objects
    return ctx.render({
      user,
      date: parsedDate.data,
      monthAudios,
      theme: ctx.state.theme,
    });
  },
};

export default function Home({ data }: HomeProps) {
  return (
    <Layout user={data.user} theme={data.theme}>
      <LoadSidebar />
      <Control date={data.date} audios={data.monthAudios} />
    </Layout>
  );
}
