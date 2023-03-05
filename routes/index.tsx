import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";

const deploymentId = Deno.env.get("DENO_DEPLOYMENT_ID") ?? undefined;

export default function Home() {
  return (
    <>
      <Head>
        <title>Audio Logbook</title>
      </Head>
      <div>
        <pre>Deno Deployment ID{deploymentId}</pre>
        <h1>Audio Logbook</h1>
        
        <script async src="https://telegram.org/js/telegram-widget.js?21" data-telegram-login="audio_logbook_bot" data-size="large" data-auth-url="/auth/callback" data-request-access="write"></script>
      </div>
    </>
  );
}
