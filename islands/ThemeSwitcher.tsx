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
        // value binding
        // and onChange handler will be hydrated client side
      >
        <option value="light">Light 🌞</option>
        <option value="dark">Dark 🌙</option>
      </select>
    );
  }

  // Anything here runs on the client!
  // Important: AND RE-RUNS when useState hook changes!!!

  // Halts in chrome
  debugger;

  // get htmlTag
  const htmlTag = document.firstElementChild;
  if (!htmlTag) throw new Error(`<html> tag could not be found!`);

  const storedTheme = localStorage.getItem("theme")?.trim() ?? "";

  // applies the theme to the html tag
  const changeTheme = (newTheme: string) => {
    htmlTag?.setAttribute(`theme`, newTheme);
    localStorage.setItem("theme", newTheme);
  };

  let theme = storedTheme;

  if (theme === "") {
    // read system color scheme
    const systemColorScheme = getComputedStyle(htmlTag)
      .getPropertyValue("--system-color-scheme").trim();

    // set system color scheme to localStorage
    localStorage.setItem("theme", systemColorScheme);

    // apply the system color scheme theme
    theme = systemColorScheme;
  }

  // apply theme
  changeTheme(theme);

  return (
    <select
      name="theme"
      id="theme-switcher"
      value={theme}
      onChange={(e) => changeTheme((e.target as HTMLSelectElement).value)}
    >
      <option value="light">Light 🌞</option>
      <option value="dark">Dark 🌙</option>
    </select>
  );
}
