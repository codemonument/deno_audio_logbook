import { useState } from "preact/hooks";

export type Audio = {
  unixTimestamp: number;
  audioFile: string;
  fileTitle: string;
};

export default function Audio(props: { audio: Audio }) {
  const [audioLoaded, setAudioLoaded] = useState(false);

  return (
    <div className="audio">
      {!audioLoaded
        ? (
          <button
            className="gg-play-button-o"
            onClick={() => setAudioLoaded(true)}
          >
            |&gt;
          </button>
        )
        : <audio controls src={props.audio.audioFile} />}
      {/*<span>{props.audio.fileTitle}</span>*/}
    </div>
  );
}
