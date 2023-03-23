import Month from "@/components/Month.tsx";

import DateChanger from "@/islands/DateChanger.tsx";
import LoadAndPrepareAudio from "@/islands/LoadAndPrepareAudio.tsx";

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
        month={props.date.month}
        year={props.date.year}
      />
    </div>
  );
}
