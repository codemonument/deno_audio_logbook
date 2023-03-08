// Data (audio file information) comes passed down via props

import Audio from "./Audio.tsx";

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

export default function Day(props: { day: number }) {
  // Save State for audio shown / loaded

  return (
    <div className="day">
      <span className="dayNumber">{props.day}</span>
      <div>
        {
          // map over audio array
          audio.map((audio) => {
            return <Audio audio={audio} />;
          })
        }
      </div>
    </div>
  );
}
