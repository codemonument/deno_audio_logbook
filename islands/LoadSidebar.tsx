import Loading from "@/components/Loading.tsx";
import type { AudioEntries } from "@/components/AudioBacklogSidebar.tsx";
import AudioBacklogSidebar from "@/components/AudioBacklogSidebar.tsx";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function LoadSidebar() {
  if (IS_BROWSER) {
    const [entries, setEntries] = useState<AudioEntries | null>(null);

    if (!entries) {
      fetch("/api/fetchData?whichData=sidebar")
        .then((response) => response.json())
        .then((entries) => setEntries({ entries: entries }));
      return <Loading />;
    }

    return <AudioBacklogSidebar entries={entries.entries} />;
  } else {
    return <Loading />;
  }
}
