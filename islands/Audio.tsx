import { useEffect, useState } from "preact/hooks";
import { Howl, Howler } from "howler";
import { signal } from "@preact/signals";

export type Audio = {
  unixTimestamp: number;
  audioFile: string;
  fileTitle: string;
};

export default function Audio(props: { audio: Audio }) {
  const [playing, setPlaying] = useState(false);

  const [sound] = useState(
    new Howl({
      src: [props.audio.audioFile],
      html5: true,
    }),
  );

  useEffect(() => {
    sound.on("play", () => setPlaying(true));
    sound.on("stop", () => setPlaying(false));
    sound.on("pause", () => setPlaying(false));

    sound.on("end", () => {
      setPlaying(false);
    });
  }, [sound]);

  return (
    <button
      className="audio"
      onClick={() => (playing) ? sound.pause() : sound.play()}
    >
      {(playing) ? "||" : "|>"} &nbsp;
      {props.audio.fileTitle}
    </button>
  );
}
