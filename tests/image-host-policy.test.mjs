import test from 'node:test';
import assert from 'node:assert/strict';
import nextConfig from '../next.config.js';

test('optimized remote images use an explicit HTTPS hostname allowlist', () => {
  const patterns = nextConfig.images.remotePatterns;

  assert.ok(
    patterns.some((pattern) => pattern.protocol === 'https' && pattern.hostname === 'images.unsplash.com'),
    'The template library image host should remain available'
  );
  assert.equal(
    patterns.some((pattern) => pattern.hostname === '**' || pattern.hostname === '*'),
    false,
    'A wildcard host would allow the image optimizer to fetch arbitrary remote hosts'
  );
});

test('local media is allowed only from the development media path', () => {
  const localMedia = nextConfig.images.remotePatterns.find((pattern) => pattern.hostname === 'localhost');

  assert.deepEqual(localMedia, {
    protocol: 'http',
    hostname: 'localhost',
    port: '3005',
    pathname: '/media/**',
  });
});
