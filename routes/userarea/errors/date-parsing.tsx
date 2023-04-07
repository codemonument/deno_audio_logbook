import { MONTH_NUMBER_STRING } from "@/src/const/client_constants.ts";
import Layout from "@/components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { ContextState } from "@/src/context_state.ts";
import { UserSession } from "@/src/db/db_schema.ts";

/**
 * @requires ctx.state.user => The user session, resolved by the _middleware.ts file
 */
export const handler: Handlers<unknown, ContextState> = {
  GET(_req, ctx) {
    // Render calendar with audio and user objects
    return ctx.render({ user: ctx.state.user });
  },
};

export default function DateParsingErrorPage(
  props: PageProps<{ user: UserSession }>,
) {
  const currentMonth = MONTH_NUMBER_STRING[new Date().getMonth()];
  const currentYear = new Date().getFullYear().toString();

  return (
    <Layout user={props.data.user}>
      <div class="error medium-width">
        <h2 style="padding-bottom: var(--size-4)">
          Oooops!
        </h2>
        You passed a invalid date, so the calendar cannot be shown! <br />{" "}
        <br />
        Please specify ...
        <ul>
          <li>a year &gt; 1970</li>
          <li>and a month between 01 - 12</li>
        </ul>
        <br />
        ...or &nbsp;
        <a href={`/userarea/calendar/${currentYear}/${currentMonth}`}>
          Go back to Calendar with current month
        </a>
      </div>
    </Layout>
  );
}
