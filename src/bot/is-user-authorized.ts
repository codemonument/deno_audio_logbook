const whitelistedUsers = [
  1722753347, //@Bloodiko
  641861927, //@bjesuiter
];

export function isUserAuthorized(userId: number) {
  return whitelistedUsers.includes(userId);
}
