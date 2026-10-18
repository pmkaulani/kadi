import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionToken } from '../src/lib/auth/session.ts';
import { getEdgeSessionPayload, isEdgeSessionPresent } from '../src/lib/auth/edge-session.ts';

const originalSecret = process.env.AUTH_SECRET;
const originalNodeEnv = process.env.NODE_ENV;
const testSecret = 'kadi-test-only-secret-with-more-than-32-characters';

function encodeBase64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}

test('edge middleware accepts a correctly signed, unexpired session', async () => {
  process.env.AUTH_SECRET = testSecret;
  process.env.NODE_ENV = 'test';

  try {
    const token = createSessionToken({
      id: 'host-test-1',
      email: 'host@example.com',
      name: 'Test Host',
      role: 'host',
    });

    assert.equal(await isEdgeSessionPresent(token), true);
    assert.equal((await getEdgeSessionPayload(token))?.role, 'host');
  } finally {
    if (originalSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalSecret;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  }
});

test('edge middleware rejects unsigned and tampered session payloads', async () => {
  process.env.AUTH_SECRET = testSecret;
  process.env.NODE_ENV = 'test';

  try {
    const forgedPayload = encodeBase64Url(JSON.stringify({
      id: 'attacker',
      email: 'attacker@example.com',
      name: 'Attacker',
      role: 'admin',
      exp: Date.now() + 60_000,
    }));

    assert.equal(await isEdgeSessionPresent(`${forgedPayload}.not-a-valid-signature`), false);
    assert.equal(await getEdgeSessionPayload(`${forgedPayload}.not-a-valid-signature`), null);

    const valid = createSessionToken({
      id: 'host-test-2',
      email: 'host@example.com',
      name: 'Test Host',
      role: 'host',
    });
    const [payload] = valid.split('.');
    const alteredPayload = encodeBase64Url(JSON.stringify({
      id: 'attacker',
      email: 'attacker@example.com',
      name: 'Attacker',
      role: 'admin',
      exp: Date.now() + 60_000,
    }));

    assert.notEqual(payload, alteredPayload);
    assert.equal(await isEdgeSessionPresent(`${alteredPayload}.${valid.split('.')[1]}`), false);
  } finally {
    if (originalSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalSecret;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  }
});

test('edge middleware fails closed in production when AUTH_SECRET is missing', async () => {
  process.env.NODE_ENV = 'production';
  delete process.env.AUTH_SECRET;

  try {
    const payload = encodeBase64Url(JSON.stringify({
      id: 'host-test-3',
      email: 'host@example.com',
      name: 'Test Host',
      role: 'host',
      exp: Date.now() + 60_000,
    }));
    assert.equal(await isEdgeSessionPresent(`${payload}.signature`), false);
  } finally {
    if (originalSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalSecret;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  }
});

test('edge middleware rejects placeholder secrets in production', async () => {
  process.env.NODE_ENV = 'test';
  process.env.AUTH_SECRET = 'placeholder_super_secret_session_key_min_32_characters';

  try {
    const token = createSessionToken({
      id: 'host-test-placeholder',
      email: 'host@example.com',
      name: 'Test Host',
      role: 'host',
    });

    process.env.NODE_ENV = 'production';
    assert.equal(await isEdgeSessionPresent(token), false);
  } finally {
    if (originalSecret === undefined) delete process.env.AUTH_SECRET;
    else process.env.AUTH_SECRET = originalSecret;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  }
});
