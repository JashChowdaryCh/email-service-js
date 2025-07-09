// tests/emailService.test.js
const EmailService = require('../src/services/EmailService');
const ProviderA = require('../src/services/ProviderA');
const ProviderB = require('../src/services/ProviderB');

// Reset environment before each test
beforeEach(() => {
  EmailService.reset();
  ProviderA.resetFailures();
  ProviderB.resetFailures();
});

describe('EmailService', () => {
  test('should send email using ProviderA on first try', async () => {
    const response = await EmailService.sendEmail({
      to: 'a@test.com',
      subject: 'Hello',
      body: 'Test email'
    });
    expect(response.success).toBe(true);
    expect(response.provider).toBe('ProviderA');
  });

  test('should retry and fallback to ProviderB if ProviderA fails', async () => {
    ProviderA.forceFail(true); // Simulate failure
    const response = await EmailService.sendEmail({
      to: 'b@test.com',
      subject: 'Fallback',
      body: 'Test fallback'
    });
    expect(response.success).toBe(true);
    expect(response.provider).toBe('ProviderB');
  });

  test('should prevent duplicate emails (idempotency)', async () => {
    const payload = {
      to: 'c@test.com',
      subject: 'Duplicate',
      body: 'Same',
      idempotencyKey: 'dup-key-123'
    };
    const first = await EmailService.sendEmail(payload);
    const second = await EmailService.sendEmail(payload);
    expect(second.success).toBe(first.success);
    expect(second.provider).toBe(first.provider);
  });

  test('should rate limit after 5 requests', async () => {
    const payload = {
      to: 'rate@test.com',
      subject: 'Spam',
      body: 'Rate test'
    };
    for (let i = 0; i < 5; i++) {
      const res = await EmailService.sendEmail(payload);
      expect(res.success).toBe(true);
    }
    const sixth = await EmailService.sendEmail(payload);
    expect(sixth.success).toBe(false);
    expect(sixth.error).toBe('Rate limit exceeded');
  });

  test('should open circuit after 3 failures and block provider temporarily', async () => {
    ProviderA.forceFail(true);
    for (let i = 0; i < 3; i++) {
      await EmailService.sendEmail({
        to: `cb${i}@test.com`,
        subject: 'CB',
        body: 'Breaker'
      });
    }
    const res = await EmailService.sendEmail({
      to: 'cb3@test.com',
      subject: 'CB Final',
      body: 'Breaker still open'
    });
    expect(res.provider).toBe('ProviderB'); // ProviderA blocked
  });
});
