# BORDERBUILT (border-built.com)

Border Built is an El Paso–Juárez car community and lifestyle brand. We build and showcase unique cars, host events, collaborate with local businesses, and create automotive merchandise with official vehicle sweepstakes.

---

## 🏎️ Architecture & Tech Stack

```
border-built/
├── frontend/             # React 18, Vite, Tailwind CSS, Stripe Elements, Framer Motion
├── backend/              # CodeIgniter 4 PHP REST API, MySQL, Stripe Webhooks
├── deployment/           # Automated deployment scripts (FTP to border-built.com)
└── README.md
```

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (dark automotive theme `#0a0a0a` with neon accent `#6af425`)
- **State Management**: Zustand
- **Payments**: Stripe Elements (Live Mode)
- **Features**:
  - Live Sweepstakes Showcase & Multiplier Countdowns
  - Official Merch Store & Dynamic Cart Drawer
  - Standalone About & Community Landing Page (`/about`, `/qr`) with dynamic QR code
  - Interactive Support & Contact Modal with direct Gmail Web integration
  - Comprehensive Classified-style Legal & Help Center (`/legal`) with tabs: Official Rules, Shipping & Deliveries, Returns & Exchanges, Scam Prevention, Terms, and Privacy.

### Backend
- **Framework**: CodeIgniter 4 (PHP 8.1+)
- **Database**: MySQL
- **Payments & Webhooks**: Stripe API (`/api/webhook/stripe`)
- **Modules**:
  - Products & Inventory Management
  - Order Processing & Automatic Sweepstakes Entry Ledger
  - Spanish/English bilingual support
  - Image optimization pipeline (saving uploaded images to static storage rather than heavy base64 strings)
  - Admin Dashboard, Audit Logs, and User Management

---

## 🚀 Getting Started

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
To build for production:
```bash
npm run build
```

### 2. Backend Setup
```bash
cd backend
composer install
```
Configure your database and Stripe credentials in `backend/env` (copied from `env.example`).

---

## 📦 Deployment

To deploy the production build to `border-built.com`:
```bash
cd frontend
npm run build
cd ../deployment
python deploy_frontend.py
```

---

## 📄 License & Ownership
Copyright © 2026 BORDERBUILT LLC. All rights reserved.
