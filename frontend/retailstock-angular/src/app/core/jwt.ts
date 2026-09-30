export interface JwtPayload {
  sub?: string;
  exp?: number;
  [key: string]: unknown;
}

export function decodeToken(token: string | null | undefined): JwtPayload | null {
  if (!token) return null;
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = part.padEnd(Math.ceil(part.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null | undefined): boolean {
  const payload = decodeToken(token);
  return !!payload?.exp && payload.exp * 1000 > Date.now();
}
