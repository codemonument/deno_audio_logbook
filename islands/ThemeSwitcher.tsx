import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";
import cookies from "js-cookie";
import { COOKIE_THEME } from "@/src/const/client_constants.ts";

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

  // get tags
  const htmlTag = document.firstElementChild;
  const bodyTag = document.querySelector("body");
  if (!htmlTag) throw new Error(`<html> tag could not be found!`);
  if (!bodyTag) throw new Error(`<body> tag could not be found!`);

  // applies the theme to the html tag
  const changeTheme = (newTheme: string) => {
    bodyTag?.setAttribute(`data-theme`, newTheme);
    cookies.set(COOKIE_THEME, newTheme, { secure: false, sameSite: "lax" });
  };

  let theme = cookies.get(COOKIE_THEME);

  if (theme === undefined) {
    // read system color scheme
    const defaultTheme = getComputedStyle(htmlTag)
      .getPropertyValue("--system-color-scheme").trim();
    theme = defaultTheme;
  }

  // apply theme & save it to the cookie
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
