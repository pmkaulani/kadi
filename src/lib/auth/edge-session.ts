export const SESSION_COOKIE_NAME = 'kadi_session';

type EdgeSessionPayload = {
  id: string;
  role: 'host' | 'planner' | 'admin';
  email: string;
  exp: number;
};

const DEVELOPMENT_SECRET = 'kadi_dev_session_secret_key_minimum_32_characters_long';

function getEdgeAuthSecret(): string | null {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32 && secret !== DEVELOPMENT_SECRET && !/placeholder|change[-_ ]?me|your[-_ ]?secret/i.test(secret)) return secret;

  // The built-in fallback is intentionally limited to non-production local work.
  if (process.env.NODE_ENV !== 'production') return secret || DEVELOPMENT_SECRET;
  return null;
}

function decodeBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function isSessionPayload(value: unknown): value is EdgeSessionPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Partial<EdgeSessionPayload>;
  return (
    typeof payload.id === 'string' &&
    payload.id.length > 0 &&
    typeof payload.email === 'string' &&
    typeof payload.exp === 'number' &&
    Number.isFinite(payload.exp) &&
    Date.now() < payload.exp &&
    (payload.role === 'host' || payload.role === 'planner' || payload.role === 'admin')
  );
}

/**
 * Verifies the HMAC signature in Edge-compatible Web Crypto before trusting a
 * session payload. A decodable payload alone is never proof of authentication.
 */
async function verifyEdgeSession(token?: string): Promise<EdgeSessionPayload | null> {
  if (!token || typeof token !== 'string' || token.length > 4096) return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  const secret = getEdgeAuthSecret();
  if (!secret) return null;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const isSignatureValid = await crypto.subtle.verify(
      'HMAC',
      key,
      decodeBase64Url(parts[1]),
      new TextEncoder().encode(parts[0])
    );
    if (!isSignatureValid) return null;

    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
    return isSessionPayload(payload) ? payload : null;
  } catch {
    return null;
  }
}

export async function isEdgeSessionPresent(token?: string): Promise<boolean> {
  return Boolean(await verifyEdgeSession(token));
}

export async function getEdgeSessionPayload(token?: string): Promise<EdgeSessionPayload | null> {
  return verifyEdgeSession(token);
}
