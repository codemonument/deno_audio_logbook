import Day from "@/components/Day.tsx";
import type { Audio } from "@/components/Day.tsx";

type AudioDayMap = {
  [day: number]: Audio[];
};

export default function Month(
  props: { month: number; year: number; audios: Audio[] },
) {
  //month year used to calculate days in month and first day of month

  const daysInMonth = new Date(props.year, props.month, 0).getDate();
  const firstDayOfMonth = new Date(props.year, props.month, 1).getDay();

  // TODO: Map Audios to <Day>s @Bloodiko
  // Array<Tag des Monats 0-30, Audio[]>
  const audioDayMap: AudioDayMap = {};

  props.audios.forEach((audio) => {
    const day = new Date(audio.unixTimestamp * 1000).getDate();
    if (!audioDayMap[day]) {
      audioDayMap[day] = [];
    }

    audioDayMap[day].push(audio);
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Sun</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
        </tr>
      </thead>
      <tbody>
        {
          // create rows
          [...Array(Math.ceil((daysInMonth + firstDayOfMonth) / 7))].map(
            (_, i) => {
              return (
                <tr>
                  {
                    // create cells
                    [...Array(7)].map((_, j) => {
                      const day = i * 7 + j - firstDayOfMonth + 1;
                      return (
                        <td>
                          {day > 0 && day <= daysInMonth
                            ? <Day day={day} audios={audioDayMap[day]} />
                            : <span></span>}
                        </td>
                      );
                    })
                  }
                </tr>
              );
            },
          )
        }
      </tbody>
    </table>
  );
}
