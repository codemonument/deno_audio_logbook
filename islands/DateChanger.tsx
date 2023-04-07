import { MONTH_NUMBER_STRING } from "@/src/const/client_constants.ts";

enum Direction {
  PREV = 1,
  NEXT = 2,
}

export default function DateChanger(
  props: { date: { month: number; year: number } },
) {
  const changeMonth = (direction: Direction) => {
    switch (direction) {
      case Direction.NEXT:
        if (props.date.month > 10) {
          window.location.href = `/userarea/calendar/${props.date.year + 1}/01`;
        } else {
          window.location.href = `/userarea/calendar/${props.date.year}/${
            MONTH_NUMBER_STRING[props.date.month + 1]
          }`;
        }
        break;
      case Direction.PREV:
        if (props.date.month < 1) {
          window.location.href = `/userarea/calendar/${props.date.year - 1}/12`;
        } else {
          window.location.href = `/userarea/calendar/${props.date.year}/${
            MONTH_NUMBER_STRING[
              props.date.month - 1
            ]
          }`;
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <button
        className="changeMonth"
        onClick={() => changeMonth(Direction.PREV)}
      >
        ←
      </button>
      <span class="date-changer-text">
        {MONTH_NUMBER_STRING[props.date.month]}&nbsp;-&nbsp;{props.date.year}
      </span>
      <button
        className="changeMonth"
        onClick={() => changeMonth(Direction.NEXT)}
      >
        →
      </button>
    </>
  );
}
