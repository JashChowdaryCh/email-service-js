const { EmailService } = require('../services/EmailService');
const { logger } = require('../utils/logger');

class JobQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.emailService = new EmailService();
  }

  // Add job to the queue
  enqueue(emailPayload) {
    this.queue.push(emailPayload);
    logger.info(`📥 Job added to queue. Queue size: ${this.queue.length}`);
    this.processQueue();
  }

  async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift(); // FIFO
      try {
        const result = await this.emailService.send(job);
        logger.info(`📤 Processed email job: ${JSON.stringify(result)}`);
      } catch (error) {
        logger.error(`❌ Failed to process job: ${error.message}`);
      }
    }

    this.processing = false;
  }
}

const jobQueue = new JobQueue();
module.exports = { jobQueue };
