import { PageProps } from "$fresh/server.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function ThemeSwitcher(props: { selected: string }) {
  let doc: Element | null;

  if (IS_BROWSER) {
    doc = document.firstElementChild;
  }

  const changeTheme = (theme: string) => {
    doc?.setAttribute(`color-scheme`, theme);
  };

  changeTheme(props.selected);

  return (
    <select
      name="theme"
      id="theme-switcher"
      onChange={(e) => changeTheme((e.target as HTMLSelectElement).value)}
    >
      <option value="light" selected>Light 🌞</option>
      <option value="dark">Dark 🌙</option>
    </select>
  );
}
