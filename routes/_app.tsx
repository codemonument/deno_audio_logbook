import { AppProps, Handlers } from "$fresh/server.ts";
import { ContextState } from "@/src/context_state.ts";
import { asset, Head } from "$fresh/runtime.ts";

export const handler: Handlers<unknown, ContextState> = {
  // async GET(_req, ctx) {
  // },
};

export default function App({ Component }: AppProps) {
  return (
    <html data-custom="data">
      <Head>
        <title>Audio Logbook</title>
        <link rel="stylesheet" href={asset("/reset.css")} />
        <link rel="stylesheet" href="/postcss/global.css" />
      </Head>
      <body class="bodyClass">
        <Component />
      </body>
    </html>
  );
}
