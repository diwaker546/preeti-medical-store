# Preeti Medical Store 💊

An end-to-end e-commerce pharmacy app for India.  
Owner: **Chitrasen Yadav** (📱 7525837320)  

---

## Features

- 📱 Login with Indian mobile number (via AWS Cognito OTP).
- 🌐 Language selection (Hindi / English).
- 📝 Customer profile (name, address, phone).
- 💊 Order medicines by:
  - Uploading a prescription photo
  - Adding items manually
- 🛒 Browse products uploaded by admin.
- 🔔 Real-time WhatsApp notifications (Twilio):
  - Owner receives new orders instantly.
  - Customers receive confirmation & status updates.
- 📦 Admin portal:
  - Add/edit products.
  - View all orders.
  - Update order status + notes.
  - Auto-refresh order list.

---

## Tech stack

- **Frontend**: Next.js 14 + React + AWS Amplify (Auth)
- **Backend**: AWS Lambda (Node.js 20) via Serverless Framework
- **Database**: DynamoDB
- **Storage**: S3 (for prescription photos, product images)
- **Auth**: Cognito (OTP to Indian mobile numbers)
- **Notifications**: Twilio WhatsApp API
- **Infra**: Serverless Framework + AWS CloudFormation
- **CI/CD**: GitHub → AWS (optional)

---

## Local setup

1. Clone repo:
   ```bash
   git clone <your-repo-url>
   cd preeti-medical-store
