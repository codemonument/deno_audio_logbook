import { PageProps } from "$fresh/server.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";


type ThemeSwitcherProp = {
  selected: string;
};

export default function ThemeSwitcher(props: PageProps<ThemeSwitcherProp>) {
    let doc: Element | null; 

    if (IS_BROWSER) {
        doc = document.firstElementChild;
    }

    const changeTheme = (event: Event) => {
        const theme = (event.target as HTMLSelectElement).value;
        doc?.setAttribute(`color-scheme`, theme);
      };

  return (
    <select name="theme" id="theme-switcher" onChange={changeTheme}>
      <option value="light" selected>Light 🌞</option>
      <option value="dark">Dark 🌙</option>
    </select>
  );
}
