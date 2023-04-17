import { getCookies } from "$std/http/cookie.ts";
import { COOKIE_THEME } from "@/src/const/client_constants.ts";
import { Theme } from "@/src/types/theme.ts";

export function getThemeOnServer(req: Request) {
  // TODO:
  // Detect the default via client hint headers:
  // https://dev.to/bryce/detecting-dark-mode-on-every-request-21b2
  const defaultTheme = "dark";
  const cookieTheme = getCookies(req.headers)[COOKIE_THEME] ?? defaultTheme;

  return cookieTheme as Theme;
}
