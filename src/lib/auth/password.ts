import crypto from 'crypto';

/**
 * Secure password hashing using Node.js PBKDF2 with salt.
 * Produces format: pbkdf2$iterations$salt$hash
 */
const ITERATIONS = 10000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
      return false;
    }
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const originalHash = parts[3];

    const hashToVerify = crypto
      .pbkdf2Sync(password, salt, iterations, KEY_LEN, DIGEST)
      .toString('hex');

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(originalHash, 'hex'),
      Buffer.from(hashToVerify, 'hex')
    );
  } catch {
    return false;
  }
}
