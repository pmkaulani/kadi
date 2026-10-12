import test from 'node:test';
import assert from 'node:assert/strict';

import { MpesaAdapter } from '../src/lib/adapters/mpesa-adapter';
import { WhatsAppAdapter } from '../src/lib/adapters/whatsapp-adapter';

test('M-Pesa Adapter - refuses direct STK push collection when compliance gates are not cleared', async () => {
  const adapter = new MpesaAdapter({ directCollectionEnabled: false });

  const response = await adapter.initiateSTKPush({
    phone: '+254712345678',
    amount: 1000,
    accountReference: 'Wedding Gift',
    transactionDesc: 'Contribution',
  });

  assert.equal(response.status, 'disabled_pending_compliance');
  assert.match(response.message, /Direct M-Pesa collection is currently disabled/);
});

test('M-Pesa Adapter - deduplicates identical webhook callback requests', () => {
  const adapter = new MpesaAdapter();

  const firstCall = adapter.handleCallback({
    checkoutRequestId: 'ws_CO_12345678',
    resultCode: 0,
    resultDesc: 'The service request is processed successfully.',
    amount: 500,
    mpesaReceiptNumber: 'QWE123RTY',
  });

  assert.equal(firstCall.status, 'succeeded');
  assert.equal(firstCall.receiptNumber, 'QWE123RTY');

  // Second call with identical checkoutRequestId
  const secondCall = adapter.handleCallback({
    checkoutRequestId: 'ws_CO_12345678',
    resultCode: 0,
    resultDesc: 'The service request is processed successfully.',
  });

  assert.equal(secondCall.status, 'duplicate_ignored');
});

test('WhatsApp Adapter - generates clean native deep-link without requiring API keys', () => {
  const adapter = new WhatsAppAdapter();
  const link = adapter.generateNativeShareLink(
    'Kevin & Wanjiku Wedding',
    'https://kadi.co.ke/e/kevin-and-wanjiku'
  );

  assert.ok(link.startsWith('https://wa.me/?text='));
  assert.ok(link.includes('https%3A%2F%2Fkadi.co.ke%2Fe%2Fkevin-and-wanjiku'));
});

test('WhatsApp Adapter - strictly denies automated sending without pre-logged consent', () => {
  const adapter = new WhatsAppAdapter();
  const gateCheck = adapter.canSendAutomatedMessage(false);

  assert.equal(gateCheck.allowed, false);
  assert.match(gateCheck.reason, /disabled in platform configuration|Explicit affirmative consent record is absent/);
});
