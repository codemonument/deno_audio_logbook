// Data (audio file information) comes passed down via props

import Audio from "@/islands/Audio.tsx";

export type Audio = { unixTimestamp: number; url: string; filePath: string };

// mock data TMP - UNUSED
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
  // remap Audio type to expected Audio type from Audio.tsx Island
  const audiosNew = props.audios?.map((audio) => {
    return {
      unixTimestamp: audio.unixTimestamp,
      audioFile: audio.url,
      fileTitle: audio.filePath,
    };
  });

  return (
    <div className="day">
      <span className="dayNumber">{props.day}</span>

      {
        // map over audio array
        audiosNew?.map((audio) => {
          return <Audio audio={audio} />;
        })
      }
    </div>
  );
}
