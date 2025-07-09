# 📧 Resilient Email Sending Service (Node.js)

A robust backend email API service built with JavaScript (Node.js + Express), featuring fault tolerance, exponential retries, fallback between providers, idempotency, queueing, rate limiting, circuit breaker, and full status tracking.

> 🚀 **Live API:** [https://email-service-js.onrender.com](https://email-service-js.onrender.com)
> 
> 📁 **GitHub Repo:** [https://github.com/JashChowdaryCh/email-service-js](https://github.com/JashChowdaryCh/email-service-js)

---

## 🧠 What This Project Does

- Sends emails using two **mock providers**
- Retries on failure with **exponential backoff**
- Switches provider if one fails (**fallback**)
- Avoids duplicate emails (**idempotency**)
- Prevents spamming using **rate limiting**
- Handles queued background emails
- Implements a **circuit breaker** on failing providers
- Simple **status logging** for every send

---

## 🛠 Tech Stack

| Area             | Tool/Tech                |
|------------------|--------------------------|
| Language         | JavaScript (Node.js)     |
| Framework        | Express.js               |
| Utilities        | `uuid`, `nodemon`, `body-parser` |
| Testing (manual) | Postman                  |
| Testing (auto)   | Jest                     |
| Hosting          | Render (Free Tier)       |
| Version Control  | Git + GitHub             |

---

## 📂 Folder Structure

email-service-js/

├── src/

│ ├── app.js

│ ├── services/

│ │ ├── EmailService.js

│ │ ├── ProviderA.js

│ │ └── ProviderB.js

│ ├── queue/

│ │ └── emailQueue.js

│ └── utils/

│ └── logger.js

├── tests/

│ └── emailService.test.js

├── .gitignore

├── package.json

└── README.md



---

## 📦 Setup Instructions (Local)

```bash
git clone https://github.com/JashChowdaryCh/email-service-js.git
cd email-service-js
npm install
npm start
```
### Runs on: http://localhost:3000

### 🌐 API Endpoints
### 🔹 POST /send-email
### Sends an email immediately with retry + fallback + circuit breaker.

### Body:
```bash
{
  "to": "test@example.com",
  "subject": "Hello",
  "body": "This is a test email",
  "idempotencyKey": "test-001"
}
```
### Response:


```bash
{
  "success": true,
  "provider": "ProviderA",
  "attempts": 1
}
```

### 🔹 POST /queue-email
### Adds email to a background queue (processed with delay).

### Body:
```bash
{
  "to": "queue@example.com",
  "subject": "Queued Email",
  "body": "This email will be processed in the background"
}
```
### Response:

```bash
{
  "message": "Email added to queue"
}
```
### ✅ Features Checklist

Feature	Status

Two mock providers	✅

Retry with exponential backoff	✅

Fallback to secondary provider	✅

Idempotency to avoid duplicates	✅

Rate limiting (5/min/email)	✅

Queue-based background emails	✅

Circuit breaker on failures	✅

Timestamped logging	✅

Unit tests with Jest	✅

API tested via Postman	✅

Deployed to Render	✅


### 🔬 Testing Summary
### 🧪 Manual Testing (Postman)

Tested all endpoints (/send-email, /queue-email)

Verified retry, fallback, duplicate protection, rate limits, etc.

### 🧪 Automated Testing (Jest)
```bash
npm test
```
### Covers:

Provider switching


Retry logic


Idempotency


Rate limiting


Circuit breaker


### 🔒 Assumptions
No real email is sent (mock providers simulate delivery)

Idempotency and rate limits are in-memory

No database used

Queue and state reset on server restart

### ✍️ Author
Jaswanth Chilakalapudi

📧 Email: chilakalapudijaswanth@gmail.com

📦 GitHub: github.com/JashChowdaryCh

🌐 Live API: https://email-service-js.onrender.com


### 📜 License
This project is part of the PearlThoughts Backend Developer Trainee submission.

Use or extend with proper attribution.

