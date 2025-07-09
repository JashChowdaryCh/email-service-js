class ProviderB {
  constructor() {
    this.name = 'ProviderB';
  }

  async send({ to, subject, body }) {
    console.log(`[${this.name}] Sending email to ${to}...`);

    // Simulate random failure
    if (Math.random() < 0.5) {
      throw new Error(`${this.name} failed to send email`);
    }

    console.log(`[${this.name}] Email sent to ${to}`);
    return true;
  }
}

module.exports = { ProviderB };
