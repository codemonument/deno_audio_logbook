import { MONTH_NUMBER_STRING } from "@/src/const/client_constants.ts";

/**
 * Simplifies generating a redirect response for (mostly temporary) redirects, like errors, login page, etc.
 *
 * @requires serverOrigin.promise  the origin url of the server, detected by /routes/_middleware.ts
 * @param target: The absolute url to redirect to, for example /auth/login, or /errors/date-parsing
 */
export function gotoInternal(
  target: string,
) {
  return new Response("", {
    status: 302,
    headers: new Headers(
      [
        ["location", target],
      ],
    ),
  });
}

export function gotoCalendar() {
  const currentMonth = MONTH_NUMBER_STRING[new Date().getMonth()];
  const currentYear = new Date().getFullYear().toString();

  return gotoInternal(`/userarea/calendar/${currentYear}/${currentMonth}`);
}

export function gotoLogin() {
  return gotoInternal(`/auth/login`);
}
