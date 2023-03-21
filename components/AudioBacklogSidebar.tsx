/**
 * @file AudioBacklogSidebar.tsx
 * Component for Audio Backlog Sidebar.
 * Searches for audio files in the database and displays them in a sidebar sorted by month and year.
 *
 * @argument {number} userId - User ID.
 */

import { MONTH_NUMBER_STRING } from "@/src/const/client_constants.ts";

type AudioBacklogSidebarProps = {
  entries: { unixTimestamp: number }[];
};

type filteredEntries = {
  [year: number]: {
    [month: number]: { unixTimestamp: number }[];
  };
};

export default function AudioBacklogSidebar(
  props: AudioBacklogSidebarProps,
) {
  // filter them by month and year
  const filteredEntries = props.entries.reduce((acc, entry) => {
    const date = new Date(entry.unixTimestamp * 1000); // Important: DB stores unix timestamp in seconds, but JS Date() expects milliseconds.
    const month = date.getMonth();
    const year = date.getFullYear();

    if (!acc[year]) {
      acc[year] = {};
    }

    if (!acc[year][month]) {
      acc[year][month] = [];
    }

    acc[year][month].push(entry);

    return acc;
  }, {} as filteredEntries);

  return (
    <div className="audioBacklogSidebar">
      {Object.keys(filteredEntries).map((year) => {
        const yearInt = parseInt(year);
        return (
          <ul>
            <li>{year}</li>
            <ul>
              {Object.keys(filteredEntries[yearInt]).map((month) => {
                const monthInt = parseInt(month);
                return (
                  <li>
                    <a
                      href={`/calendar/${year}/${
                        MONTH_NUMBER_STRING[monthInt]
                      }`}
                    >
                      {`${year} - ${
                        MONTH_NUMBER_STRING[monthInt]
                      } (Recordings: ${
                        filteredEntries[yearInt][monthInt].length
                      })`}
                    </a>
                  </li>
                );
              })}
            </ul>
          </ul>
        );
      })}
    </div>
  );
}
