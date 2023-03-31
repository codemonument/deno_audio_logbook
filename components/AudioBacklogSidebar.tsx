/**
 * @file AudioBacklogSidebar.tsx
 * Component for Audio Backlog Sidebar.
 * Searches for audio files in the database and displays them in a sidebar sorted by month and year.
 *
 * @argument {Array} entries - Array of entries from the database, containing the unix timestamp of each recording.
 */

import { MONTH_NUMBER_STRING } from "@/src/const/client_constants.ts";

export type AudioEntries = {
  entries: number[];
};

type FilteredEntries = {
  [year: number]: {
    [month: number]: number[];
  };
};

export default function AudioBacklogSidebar(
  props: AudioEntries,
) {
  // filter them by month and year
  const filteredEntries = props.entries.reduce((acc, entry) => {
    // Important: DB stores unix timestamp in seconds, but JS Date() expects milliseconds.
    const date = new Date(entry * 1000);
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
  }, {} as FilteredEntries);

  return (
    <div className="audioBacklogSidebar">
      {Object.keys(filteredEntries).map((year) => {
        const yearInt = parseInt(year);
        return (
          // Year UL
          <ul>
            <li>{year}</li>
            {/* MOTH UL */}
            <ul>
              {Object.keys(filteredEntries[yearInt]).map((month) => {
                const monthInt = parseInt(month);
                return (
                  <li>
                    <a
                      href={`/userarea/calendar/${year}/${
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
