# Thillai Amman Civil Suppliers — Website

Enterprise website for Thillai Amman Civil Suppliers (construction materials & heavy equipment rental, Coimbatore).

## Structure

```
thillai-amman-civil-suppliers/
├── index.html          → Homepage (static frontend, forms wired to the backend below)
└── backend/             → Node.js + Express API
    ├── server.js
    ├── routes/leads.js
    ├── models/Lead.js
    ├── utils/notify.js
    ├── utils/upload.js
    ├── .env.example
    └── README.md
```

## Quick start

1. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm start
   ```
2. **Frontend** — open `index.html` or serve it as a static site. Update `API_BASE` near the bottom of `index.html` to point at your deployed backend.

## Key Sections & Features

- **Hero & Stats Counter**: 1000+ Happy Customers, 300+ Sites Completed, 50+ Heavy Equipment, 24×7 Customer Support.
- **Services**: Construction Material Supply, Heavy Equipment Rental, Site & Civil Works.
- **Products**: M Sand, Blue Metal, River Sand, Bricks (with instant Quote Modal pre-filling).
- **Fleet**: Tipper Truck (1, 2 & 3 unit), JCB Excavator (3DX), Bull Skid Loader.
- **Customer Reviews**: Testimonials from Coimbatore builders and contractors with 4.9 rating badge.
- **Yard Location & Interactive Map**: 272, Tex Park Road, Phase II, Nehru Nagar West, Coimbatore, Tamil Nadu 641014 with directions link and Google Map embed.
- **Interactive Modals**: Request Quote (with drawing upload), Book Equipment, and Send Message.
- **Instant WhatsApp & Phone Calling**: Contextual click-to-chat links and native dialers for immediate lead generation.
