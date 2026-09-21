# Thillai Amman Civil Suppliers — Website

Enterprise website for Thillai Amman Civil Suppliers (construction materials & heavy
equipment rental, Coimbatore).

## Structure

```
thillai-amman-civil-suppliers/
├── index.html          → Homepage (static frontend, forms wired to the backend below)
└── backend/             → Node.js + Express API
    ├── server.js         (entry point)
    ├── routes/leads.js   (Request Quote / Book Now / Contact endpoints)
    ├── models/Lead.js    (MongoDB schema for saved enquiries)
    ├── utils/notify.js   (email + WhatsApp notification helpers)
    ├── utils/upload.js   (drawing file upload handling)
    ├── .env.example      (copy to .env and fill in your credentials)
    └── README.md         (full backend setup guide)
```

## Quick start

1. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env   # then fill in your MongoDB / SMTP / Twilio details
   npm start
   ```
   See `backend/README.md` for where to get each credential.

2. **Frontend**
   Open `index.html` directly in a browser, or serve it with any static host.
   Update the `API_BASE` constant near the bottom of `index.html` to point at
   wherever you deploy the backend (defaults to `http://localhost:5000`).

## What's working now

- Homepage with hero, services, products, fleet, and footer
- Request Quote, Book Now, and Contact forms — all save to MongoDB, email the
  office, and send a WhatsApp alert once the backend is configured
- Call Now and WhatsApp chat buttons work immediately (no backend needed)

## What's next

Pages not yet built: About, full Products catalogue, Services detail pages,
Projects, Gallery, Blog, Careers, and the admin dashboard — see the original
project brief for scope.
