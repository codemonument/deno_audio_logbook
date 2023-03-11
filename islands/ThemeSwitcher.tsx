import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";

export default function ThemeSwitcher() {
  // Simply return the <select> tag when server rendering
  // Simplifies conditional logic on client below
  if (!IS_BROWSER) {
    return (
      <select
        name="theme"
        id="theme-switcher"
        // value binding and onChange handler will be hydrated client side
      >
        <option value="light">Light 🌞</option>
        <option value="dark">Dark 🌙</option>
      </select>
    );
  }

  // Anything here runs on the client!
  // Important: AND RE-RUNS when useState hook changes!!!

  // get htmlTag
  const htmlTag = document.firstElementChild;
  if (!htmlTag) throw new Error(`<html> tag could not be found!`);

  const storedTheme = localStorage.getItem("theme")?.trim() ?? "";

  // Halts in chrome
  // debugger;

  const [theme, setTheme] = useState(storedTheme);

  // applies the theme inside the state var 'theme' to the html tag
  useEffect(() => htmlTag?.setAttribute(`theme`, theme), [theme]);

  if (!storedTheme) {
    // read system color scheme
    const systemColorScheme = getComputedStyle(htmlTag)
      .getPropertyValue("--system-color-scheme").trim();

    // set system color scheme to localStorage
    localStorage.setItem("theme", systemColorScheme);

    // apply the system color scheme theme
    setTheme(systemColorScheme);
  }

  return (
    <select
      name="theme"
      id="theme-switcher"
      value={theme}
      onChange={(e) => setTheme((e.target as HTMLSelectElement).value)}
    >
      <option value="light">Light 🌞</option>
      <option value="dark">Dark 🌙</option>
    </select>
  );
}
