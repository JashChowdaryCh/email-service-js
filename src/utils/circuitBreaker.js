const FAILURE_THRESHOLD = 3;
const TIMEOUT = 60 * 1000; // 1 minute

const providerStatus = {};

const circuitBreaker = {
  isOpen: (providerName) => {
    const status = providerStatus[providerName];
    if (!status) return false;

    const { failures, lastFailureTime } = status;

    if (failures >= FAILURE_THRESHOLD) {
      if (Date.now() - lastFailureTime < TIMEOUT) {
        return true; // Open state
      } else {
        // Timeout passed, reset
        providerStatus[providerName] = { failures: 0, lastFailureTime: 0 };
        return false;
      }
    }

    return false;
  },

  recordFailure: (providerName) => {
    if (!providerStatus[providerName]) {
      providerStatus[providerName] = { failures: 1, lastFailureTime: Date.now() };
    } else {
      providerStatus[providerName].failures += 1;
      providerStatus[providerName].lastFailureTime = Date.now();
    }
  },

  reset: (providerName) => {
    providerStatus[providerName] = { failures: 0, lastFailureTime: 0 };
  }
};

module.exports = { circuitBreaker };
