import { AppProps, Handlers } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";

// TODO: Experiment more with getting props into the App Component below
// import { getCookies } from "$std/http/cookie.ts";
// import { COOKIE_THEME } from "@/src/const/client_constants.ts";

// export const handler: Handlers<unknown, ContextState> = {
//   async GET(req, ctx) {
//     const cookieTheme = getCookies(req.headers)[COOKIE_THEME] ?? undefined;
//     return ctx.render({ cookieTheme });
//   },
// };

export default function App({ Component }: AppProps) {
  return (
    <html data-custom="data">
      <Head>
        <title>Audio Logbook</title>
        <link rel="stylesheet" href={asset("/reset.css")} />
        <link rel="stylesheet" href="/postcss/global.css" />
      </Head>

      {
        // Note:
        // <body> tag will be included by Layout.tsx,
        // which is included in each component in routes folder
        // Reason: The theme (light | dark) should be put on the body tag in a server render
        // An this App Component seems not able accept normal render props
        // from ha handler function
      }
      <Component />
    </html>
  );
}
