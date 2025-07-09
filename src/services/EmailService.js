const { ProviderA } = require('./ProviderA');
const { ProviderB } = require('./ProviderB');
const { sleep } = require('../utils/retry');
const { rateLimiter } = require('../utils/rateLimiter');
const { circuitBreaker } = require('../utils/circuitBreaker');
const { logger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Store already sent emails for idempotency
const sentEmails = new Map();

class EmailService {
  constructor() {
    this.providers = [new ProviderA(), new ProviderB()];
  }

  async send(payload) {
   const idempotencyKey = payload?.idempotencyKey || uuidv4();


    // ✅ Idempotency check
    if (sentEmails.has(idempotencyKey)) {
      logger.info('Duplicate email detected. Returning cached result.');
      return sentEmails.get(idempotencyKey);
    }

    // ✅ Rate limiting check
    if (!rateLimiter.allow()) {
      const status = {
        success: false,
        provider: '',
        attempts: 0,
        error: 'Rate limit exceeded',
      };
      sentEmails.set(idempotencyKey, status);
      return status;
    }

    let attempts = 0;
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];

      // ✅ Circuit breaker check
      if (circuitBreaker.isOpen(provider.name)) {
        logger.warn(`Provider ${provider.name} is in circuit-breaker mode.`);
        continue;
      }

      // ✅ Retry logic with exponential backoff
      for (let retry = 0; retry < 3; retry++) {
        attempts++;
        try {
          await provider.send(payload); // Mocked send
          const status = {
            success: true,
            provider: provider.name,
            attempts,
          };
          sentEmails.set(idempotencyKey, status);
          circuitBreaker.reset(provider.name); // Reset breaker if successful
          logger.info(`✅ Email sent via ${provider.name}`);
          return status;
        } catch (err) {
          logger.error(`❌ Attempt ${attempts} failed on ${provider.name}: ${err.message}`);
          circuitBreaker.recordFailure(provider.name);
          await sleep(2 ** retry * 1000); // Exponential backoff
        }
      }
    }

    // ❌ All providers failed
    const failStatus = {
      success: false,
      provider: '',
      attempts,
      error: 'All providers failed',
    };
    sentEmails.set(idempotencyKey, failStatus);
    return failStatus;
  }
}

module.exports = { EmailService };
