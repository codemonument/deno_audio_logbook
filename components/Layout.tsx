import { Head } from "$fresh/runtime.ts";
import ThemeSwitcher from "@/islands/ThemeSwitcher.tsx";
import { UserSession } from "@/src/db/db_schema.ts";
import { DEPLOYMENT_ID } from "@/src/const/server_constants.ts";
import UserInfo from "@/components/UserInfo.tsx";
import type { ComponentChildren } from "preact";
import type { Theme } from "@/src/types/theme.ts";

type LayoutProps = {
  user?: UserSession;
  h1Override?: string;
  children: ComponentChildren;
  theme: Theme;
};

export default function Layout(props: LayoutProps) {
  return (
    <body data-theme={props.theme}>
      <header>
        <h1>{(props.h1Override) ? props.h1Override : "Audio Logbook"}</h1>
        <div class="flex-gap"></div>
        {/* TODO: Put Date Seletor here? */}
        <ThemeSwitcher theme={props.theme} />
        <UserInfo user={props.user} />
      </header>

      <main>
        {props.children}
      </main>

      <footer>
        <pre>Deployment: {DEPLOYMENT_ID}</pre>
      </footer>
    </body>
  );
}
