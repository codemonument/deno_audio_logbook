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
        if (props.date.month > 11) {
          window.location.href = `/?month=${1}&year=${props.date.year + 1}`;
        } else {
          window.location.href = `/?month=${
            props.date.month + 1
          }&year=${props.date.year}`;
        }
        break;
      case Direction.PREV:
        if (props.date.month < 2) {
          window.location.href = `/?month=${12}&year=${props.date.year - 1}`;
        } else {
          window.location.href = `/?month=${
            props.date.month - 1
          }&year=${props.date.year}`;
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
      <span>
        {props.date.month}
      </span>&nbsp;-&nbsp;
      <span>{props.date.year}</span>
      <button
        className="changeMonth"
        onClick={() => changeMonth(Direction.NEXT)}
      >
        →
      </button>
    </>
  );
}
