import { MONTH_NUMBER_STRING } from "@/src/const/client_constants.ts";

export default function DateParsingErrorPage() {
  const currentMonth = MONTH_NUMBER_STRING[new Date().getMonth()];
  const currentYear = new Date().getFullYear().toString();

  return (
    <>
      <p style="background-color: red;">
        Oooops! You passed a invalid date, so the calendar cannot be shown!
        Please specify a year &gt; 1970 and a month between 01 - 12, or press
        the button below to go back to the callendar with the current month!
      </p>

      <a href={`/calendar/${currentYear}/${currentMonth}`}>
        Go back to Calendar with current month
      </a>
    </>
  );
}
