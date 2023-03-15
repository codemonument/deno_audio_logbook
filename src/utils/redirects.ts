import { MONTH_NUMBER_STRING } from "@/src/client_constants.ts";

/**
 * Simplifies generating a redirect response for (mostly temporary) redirects, like errors, login page, etc.
 *
 * @param origin: an url, for example req.url. Will be transformed as: new URL(origin).origin
 * @param target: The absolute url to redirect to, for example /auth/login, or /errors/date-parsing
 */
export function internalRedirect(
  { origin, target }: { origin: string; target: string },
) {
  return new Response("", {
    status: 302,
    headers: new Headers(
      [
        ["location", new URL(origin).origin + target],
      ],
    ),
  });
}

// TODO: rename to gotoXXX
export function redirectToCalendar(
  origin: string,
) {
  const currentMonth = MONTH_NUMBER_STRING[new Date().getMonth()];
  const currentYear = new Date().getFullYear().toString();

  return internalRedirect({
    origin,
    target: `/calendar/${currentYear}/${currentMonth}`,
  });
}

export function redirectToLogin(
  origin: string,
) {
  return internalRedirect({
    origin,
    target: `/auth/login`,
  });
}
