import Month from "@/components/Month.tsx";

import DateChanger from "@/islands/DateChanger.tsx";

type ControlProps = {
  date: { month: number; year: number };
};

export default function Control(
  props: ControlProps,
) {
  return (
    <div className="calendarWrapper">
      <div className="control">
        <DateChanger date={props.date} />
        <br />
      </div>
      <br />
      <Month
        month={props.date.month - 1 /** Note1! */}
        year={props.date.year}
      />
    </div>
  );
}

/**
 * Note1: month is 0-indexed, so January is 0, February is 1, etc, thus the -1.
 * Every other usage of month in this code is 1-indexed, thus only adjusting here where the calculation happens.
 */
