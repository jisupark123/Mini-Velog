export function createSession(userId: number) {
  const randomString = Math.random().toString(36).slice(2);
  const time = new Date().getTime();
  return `userId=${userId}&rs=${randomString + time}`;
}

export function getUserIdFromSession(sessionId: string) {
  return +String(sessionId).split('userId=')[1].split('&')[0];
}
