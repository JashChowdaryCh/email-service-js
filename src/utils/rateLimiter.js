const MAX_EMAILS_PER_MINUTE = 5;
const timeWindow = 60 * 1000; // 1 minute

let emailTimestamps = [];

const rateLimiter = {
  allow: () => {
    const now = Date.now();

    // Remove timestamps older than 1 minute
    emailTimestamps = emailTimestamps.filter(ts => now - ts < timeWindow);

    if (emailTimestamps.length >= MAX_EMAILS_PER_MINUTE) {
      return false;
    }

    emailTimestamps.push(now);
    return true;
  }
};

module.exports = { rateLimiter };
