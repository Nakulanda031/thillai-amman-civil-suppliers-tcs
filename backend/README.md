# Thillai Amman Civil Suppliers (TCS) — Backend API

Production-ready Node.js & Express REST API for **Thillai Amman Civil Suppliers**.
Handles quote requests, equipment booking submissions, drawing file uploads, office email notifications, and instant WhatsApp owner alerts.

---

## 1. Quick Start (Local Setup)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure your credentials:

| Environment Variable | Description |
|---|---|
| `PORT` | Local port (default `5000`) |
| `CLIENT_ORIGIN` | Allowed frontends (`https://nakulanda031.github.io` or `*`) |
| `MONGODB_URI` | MongoDB connection string (Atlas or local) |
| `SMTP_USER` / `SMTP_PASS` | Gmail email address and **16-character App Password** |
| `NOTIFY_EMAIL` | Office email address that receives lead notifications |
| `TWILIO_ACCOUNT_SID` | (Optional) Twilio Account SID for WhatsApp alerts |
| `TWILIO_AUTH_TOKEN` | (Optional) Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | Twilio sandbox number (`whatsapp:+14155238886`) |
| `OWNER_WHATSAPP_TO` | Owner WhatsApp number (`whatsapp:+917339301146`) |
| `ADMIN_SECRET_KEY` | Secret token protecting the `GET /api/leads` route |

### Step 3: Run the Server
```bash
# Development mode with hot-reloading:
npm run dev

# Or production start:
npm start
```
Server starts on `http://localhost:5000`. Test health at `http://localhost:5000/api/health`.

---

## 2. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/quote` | Accepts quote request (multipart/form-data with optional drawing upload) |
| `POST` | `/api/booking` | Accepts equipment booking (application/json) |
| `POST` | `/api/contact` | Accepts general contact enquiry |
| `GET` | `/api/leads` | Lists all leads (supports `?status=NEW` and `?limit=50`) |
| `PATCH` | `/api/leads/:id/status` | Updates lead status (`NEW`, `CONTACTED`, `QUOTED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`) |
| `GET` | `/api/leads/export/csv` | Downloads all leads as formatted CSV for Excel |
| `GET` | `/api/health` | Health check endpoint |

---

## 3. How to Connect Frontend to Backend

In `index.html` (or in browser console), configure the backend URL:
```javascript
window.TCS_API_BASE = 'https://your-backend-domain.com';
```
If `window.TCS_API_BASE` is omitted, the frontend automatically defaults to `http://localhost:5000`.

**Note:** If the backend is offline or sleeping, the frontend's built-in offline engine (`assets/js/leads-store.js`) will **never fail or freeze**: it immediately saves enquiries into the browser's persistent `localStorage`, displays a success message to the customer, and offers direct WhatsApp transfer!

---

## 4. Deploying to Free Cloud Hosts

You can deploy this backend for free on:
- **Render.com** (Web Service, Node runtime, Build: `npm install`, Start: `npm start`)
- **Railway.app** (Deploy from GitHub repo)
- **Fly.io**
