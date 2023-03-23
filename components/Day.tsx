// Data (audio file information) comes passed down via props

import Audio from "@/islands/Audio.tsx";

export type Audio = { unixTimestamp: number; url: string; filePath: string };

// mock data TMP
const audio = [
  {
    unixTimestamp: 1678211111,
    audioFile: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    fileTitle: "SoundHelix-Song-1",
  },
  {
    unixTimestamp: 1678200000,
    audioFile: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    fileTitle: "SoundHelix-Song-2",
  },
];

export default function Day(props: { day: number; audios?: Audio[] }) {
  // Save State for audio shown / loaded

  // TODO: @Bloodiko Finish audio rendering

  return (
    <div className="day">
      <span className="dayNumber">{props.day}</span>

      {
        // map over audio array
        audio.map((audio) => {
          return <Audio audio={audio} />;
        })
      }
    </div>
  );
}
