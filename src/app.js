const express = require('express');
const { EmailService } = require('./services/EmailService');
const { jobQueue } = require('./queue/queue');

const app = express();
app.use(express.json());

const emailService = new EmailService();

// 🔹 Immediate Email API
app.post('/send-email', async (req, res) => {
  const status = await emailService.send(req.body);
  res.json(status);
});

// 🔹 Queue-based Email API
app.post('/queue-email', (req, res) => {
  jobQueue.enqueue(req.body);
  res.json({ message: '✅ Email job enqueued successfully.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
app.get('/', (req, res) => {
  res.send(`
    <h2>📧 Email Service API</h2>
    <ul>
      <li><strong>POST</strong> /send-email - Immediate sending</li>
      <li><strong>POST</strong> /queue-email - Add to background queue</li>
    </ul>
  `);
});
