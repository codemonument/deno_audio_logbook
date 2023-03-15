import { MONTH_NUMBER_STRING } from "@/src/client_constants.ts";
import { serverOrigin } from "@/src/server_constants.ts";

/**
 * Simplifies generating a redirect response for (mostly temporary) redirects, like errors, login page, etc.
 *
 * @requires serverOrigin.promise  the origin url of the server, detected by /routes/_middleware.ts
 * @param target: The absolute url to redirect to, for example /auth/login, or /errors/date-parsing
 */
export async function internalRedirect(
  target: string,
) {
  const origin = await serverOrigin.promise;

  return new Response("", {
    status: 302,
    headers: new Headers(
      [
        ["location", origin + target],
      ],
    ),
  });
}

export function redirectToCalendar() {
  const currentMonth = MONTH_NUMBER_STRING[new Date().getMonth()];
  const currentYear = new Date().getFullYear().toString();

  return internalRedirect(`/calendar/${currentYear}/${currentMonth}`);
}

export function redirectToLogin() {
  return internalRedirect(`/auth/login`);
}
