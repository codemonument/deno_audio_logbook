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
