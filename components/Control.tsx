import { useState } from "preact/hooks";

import Month from "@/components/Month.tsx";

enum Direction {
  PREV = 1,
  NEXT = 2,
}

export default function Control() {
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2023);

  const changeMonth = (direction: Direction) => {
    switch (direction) {
      case Direction.NEXT:
        if (month > 11) {
          setMonth(1);
          setYear((year: number) => year + 1);
        } else {
          setMonth((month: number) => month + 1);
        }
        break;
      case Direction.PREV:
        if (month < 2) {
          setMonth(12);
          setYear((year: number) => year - 1);
        } else {
          setMonth((month: number) => month - 1);
        }
        break;
      default:
        break;
    }
  };
  return (
    <div className="calendarWrapper">
      <div className="control">
        <button
          className="changeMonth"
          onClick={() => changeMonth(Direction.PREV)}
        >
          &lt;
        </button>
        <span>{month}</span>&nbsp;-&nbsp;
        <span>{year}</span>
        <button
          className="changeMonth"
          onClick={() => changeMonth(Direction.NEXT)}
        >
          &gt;
        </button>
        <br />
      </div>
      <br />
      <Month month={month} year={year} />
    </div>
  );
}
