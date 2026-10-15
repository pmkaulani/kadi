import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE_NAME = 'kadi_session';
const DEFAULT_EXPIRY_DAYS = 7;

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || 'kadi_dev_session_secret_key_minimum_32_characters_long';
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'host' | 'planner' | 'admin';
  exp: number; // Unix timestamp in ms
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 */
export function createSessionToken(
  user: { id: string; email: string; name: string; role: 'host' | 'planner' | 'admin' },
  expiresInDays = DEFAULT_EXPIRY_DAYS
): string {
  const payload: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and parses a signed session token.
 * Returns null if the signature is invalid or the token has expired.
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', getAuthSecret())
      .update(encodedPayload)
      .digest('base64url');

    // Constant-time comparison
    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    const payload: SessionUser = JSON.parse(base64UrlDecode(encodedPayload));
    if (!payload.id || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the authenticated user from a Request/NextRequest.
 * Checks HTTP-only cookie first, then falls back to Authorization Bearer header.
 */
export async function getAuthSession(req?: NextRequest | Request): Promise<SessionUser | null> {
  if (!req) return null;

  // 1. Check cookies
  let token: string | undefined;
  if ('cookies' in req && typeof req.cookies?.get === 'function') {
    token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    // Standard Request headers
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  // 2. Check Authorization Bearer header fallback
  if (!token) {
    const authHeader = req.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Attaches a secure HTTP-only session cookie to a NextResponse.
 */
export function setSessionCookie(res: NextResponse, token: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: DEFAULT_EXPIRY_DAYS * 24 * 60 * 60,
  });
}

/**
 * Clears the session cookie on logout.
 */
export function clearSessionCookie(res: NextResponse): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
