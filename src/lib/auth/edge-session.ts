export const SESSION_COOKIE_NAME = 'kadi_session';

/**
 * Edge-compatible session structure and expiry validation for Next.js Middleware.
 * Does not import Node.js specific modules, ensuring zero warnings in Edge Runtime.
 */
export function isEdgeSessionPresent(token?: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  try {
    let base64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);
    return Boolean(payload?.id && payload?.exp && Date.now() < payload.exp);
  } catch {
    return false;
  }
}

export function getEdgeSessionPayload(token?: string): { id: string; role?: string; email?: string; exp: number } | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  try {
    let base64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);
    if (payload?.id && payload?.exp && Date.now() < payload.exp) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

