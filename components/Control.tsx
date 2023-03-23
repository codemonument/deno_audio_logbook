import Month from "@/components/Month.tsx";
import type { Audio } from "@/components/Day.tsx";

import DateChanger from "@/islands/DateChanger.tsx";

type ControlProps = {
  date: { month: number; year: number };
  audios: Audio[];
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
        month={props.date.month}
        year={props.date.year}
        audios={props.audios}
      />
    </div>
  );
}
