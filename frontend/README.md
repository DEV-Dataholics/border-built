# BORDERBUILT — Frontend Application (React 19 + Vite 7 + Tailwind CSS 4)

> 🏎️ **BORDERBUILT** — Binational automotive lifestyle brand & sweepstakes platform (Juárez 🇲🇽 / El Paso 🇺🇸).  
> **Core Loop:** Buy merchandise & digital packages → Earn sweepstakes entries → Win fully modified performance cars.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Version](https://img.shields.io/badge/version-1.3.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.18-38BDF8)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents
1. [Overview & Key Capabilities](#-overview--key-capabilities)
2. [Quick Start & Local Setup](#-quick-start--local-setup)
3. [Environment Configuration](#-environment-configuration)
4. [Demo Credentials & System Roles](#-demo-credentials--system-roles)
5. [Complete Application Route Directory](#-complete-application-route-directory)
6. [Key Modules & Architecture](#-key-modules--architecture)
7. [Project Directory Structure](#-project-directory-structure)
8. [API Contracts Reference](#-api-contracts-reference)
9. [Build, Test & Deployment](#-build-test--deployment)

---

## 🏁 Overview & Key Capabilities

**BORDERBUILT** combines an underground Japanese car culture aesthetic with high-performance e-commerce and a dynamic sweepstakes entry calculation engine.

* **⚡ Real-Time Entry Engine:** Automatically computes sweepstakes entries based on product prices, global campaign multipliers, and bonus package multipliers (`price × multiplier × quantity`).
* **🔥 Quick Entries Section:** High-multiplier digital packages (Bronze 500X, Silver 500X, Gold 500X) with integrated merchandise apparel size selector.
* **🏠 CMS-Driven Home Page:** Hero banner headline, event badges, project spec sheet, feature breakdown blocks, and scarcity countdown driven live from the backend API.
* **🎟️ Dual-Reward Coupon System:** Supports checkout discount coupons (% off or $ off) and standalone entry claim coupons redeemed directly into the user's garage.
* **💳 Stripe Payment Gateway:** Integrated card payment module with formatted input validation, location dropdowns (US, MX, CA), and shipping profile auto-fill.
* **🗳️ VIP Lounge & Voting Polls:** Restricted voting portal for VIP users to choose upcoming project cars, modifications, and colors.
* **🏎️ My Garage User Hub:** Tachometer entry gauge, full order history, shipping details, and entry ticket verification.
* **⚙️ Complete Admin CMS Suite:** Full administration panel covering analytics, giveaways, products, orders, users, coupons, polls, community media, and CSV audit exports.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* **Node.js** v18.0.0 or higher
* **npm** v9.0.0 or higher
* **Backend API** running locally at `http://localhost:8080/api` or `http://localhost/borderapp-api/public/api`

```bash
# 1. Clone the frontend repository
git clone https://github.com/gruizmetasolutions-cpu/borderapp-frontend.git
cd borderapp-frontend

# 2. Install dependencies
npm install

# 3. Create & configure environment file
cp .env.example .env # or edit .env directly

# 4. Start Vite development server
npm run dev

# 5. Open application in browser
# → http://localhost:5173/
```

---

## ⚙️ Environment Configuration

File location: `.env`

```env
# Backend REST API Base URL
VITE_API_URL=http://localhost:8080/api

# Stripe Public Publishable Key (Test/Live)
VITE_STRIPE_PUBLIC_KEY=pk_test_51TwTVBCaUqETf2qsy4LHbm7CApE3L7ykqpYE7WZV5VdBZib3pd2yYxPjPz2o4GeFEsNQnh0U88Vl6FmwzpS3g8tr00gpNNTRNs

# Web3Forms Contact Form Access Key (Optional)
VITE_WEB3FORMS_ACCESS_KEY=
```

---

## 🔑 Demo Credentials & System Roles

| Role | Email | Password | Scope & Access |
|---|---|---|---|
| **Admin** | `admin@borderbuilt.com` | `admin123` | Full Admin CMS Suite (`/admin`) |
| **User (VIP)** | `demo@borderbuilt.com` | `demo123` | Client Garage, VIP Lounge (`/vip`), Shop |
| **User (Standard)** | `carlos.m@test.com` | `test123` | Client Garage & Store Checkout |

---

## 🧭 Complete Application Route Directory

### 🛍️ Client Portal Routes
* **`/`** — **Home Page:** Dynamic CMS Hero, countdown timer, active giveaway progress, spec sheet, quick entries bento cards, and scarcity banner.
* **`/shop`** — **Merchandise Catalog:** Filter by category (Hoodies, T-Shirts, Accessories, Mystery Boxes, Quick Entries), price sorting, and search.
* **`/shop/:slug`** — **Product Detail Page:** Variant selector (Size & Color), image gallery, entry breakdown, and instant cart add.
* **`/how-it-works`** — **How It Works / Rules:** Sweepstakes rules, 3-step entry process, project highlight breakdown, and legal disclosures.
* **`/winners`** — **Hall of Fame:** Past giveaway winners showcase, car specs, total entries won, and community event photo gallery.
* **`/vip`** — **VIP Lounge:** Exclusive voting center for VIP members to vote on active build polls with live percentage bars.
* **`/garage`** — **My Garage:** User hub with animated tachometer entry gauge, order history, ticket numbers, and shipping profile.
* **`/checkout`** — **Stripe Checkout:** Cart items summary, coupon validation (%/$ discount), location dropdowns, shipping address, and Stripe card payment.
* **`/claim-coupon`** — **Claim Coupon Portal:** Redeem promotional entry codes directly into the user's account balance.

### 🛡️ Admin Panel Routes (`/admin`)
* **`/admin`** — **Admin Dashboard:** Total revenue KPI, total entries sold, active giveaway status, recent orders, top products, and revenue trend chart.
* **`/admin/giveaways`** — **Giveaway & Home CMS Manager:** Campaign dates, multiplier settings, price breakdown, and live Home CMS content editor (Hero title, specs, scarcity banner, image uploads).
* **`/admin/products`** — **Products & Inventory Manager:** Add/edit products, multiplier flags, tag badges, price, and variant size/color stock.
* **`/admin/orders`** — **Order Fulfillment Manager:** View client purchase orders, item details, shipping status, and update tracking status.
* **`/admin/users`** — **Users & VIP Manager:** Manage user profiles, credit/adjust entries, toggle VIP membership status, and edit shipping address.
* **`/admin/coupons`** — **Coupons Manager:** Create discount or entries coupons, set expiration date, set max uses, activate/deactivate, and audit redemption stats.
* **`/admin/polls`** — **VIP Polls Manager:** Create community polls, add choices/options, publish/close voting, and view vote counts.
* **`/admin/winners`** — **Winners & Community Manager:** Add past winners, upload car photos, and manage community event showcase photos.
* **`/admin/config`** — **Global System Configuration:** Set global entry multiplier, FOMO urgency banners, and system defaults.
* **`/admin/reports`** — **CSV Export Reports:** Generate and download complete sweepstakes entries CSV audit files for legal compliance.

---

## 💻 Key Modules & Architecture

### 1. Multiplier & Entry Calculation Engine (`src/lib/entries.js`)
Calculates sweepstakes entries deterministically:
$$\text{Entries} = \lfloor \text{Price} \times \text{Multiplier} \times \text{Quantity} \rfloor$$
Handles special product multipliers (e.g., Quick Entries 500X) over global campaign multipliers.

### 2. Location Dataset Presets (`src/lib/locationData.js`)
Standardized state and city dropdown datasets for:
* 🇺🇸 **United States:** All 50 states + major metropolitan areas.
* 🇲🇽 **Mexico:** All 32 states + major cities (Juárez, Chihuahua, Monterrey, CDMX, etc.).
* 🇨🇦 **Canada:** All provinces & territories.
* 🏁 **Other:** Open input fallback.

Shared across `Checkout.jsx` and `AdminUsers.jsx` for consistent shipping address management.

### 3. Internationalization System (`src/i18n/`)
Custom lightweight i18n hook supporting full English (`en.json`) and Mexican Spanish (`es.json`) translation keys across all public pages and admin forms.

---

## 📁 Project Directory Structure

```
BorderApp/
├── api-contracts/                 # JSON Schema API contracts for backend alignment
│   ├── auth.contract.json
│   ├── config.contract.json
│   ├── coupons.contract.json       # 🎟️ Discount & Entries Coupon API schema
│   ├── entries.contract.json
│   ├── giveaways.contract.json
│   ├── orders.contract.json
│   ├── products.contract.json
│   ├── vip-polls.contract.json
│   └── winners.contract.json
├── public/
│   ├── images/                    # Static image assets (hero, products, winners, badges)
│   │   ├── products/              # Product catalog images & placeholder fallbacks
│   │   └── winners/               # Winners & community event photos
│   └── .htaccess                  # Apache SPA rewrite fallback
├── src/
│   ├── App.jsx                    # React Router 7 main routes & layout wrapper
│   ├── components/
│   │   ├── admin/                 # HomePreview, AdminModals, Navigation
│   │   ├── features/              # QuickEntriesSection, TachometerGauge, ProductCard, CartDrawer
│   │   ├── layout/                # Header, Footer, PageTransition
│   │   └── ui/                    # Button, Input, Modal, Badge, Skeleton
│   ├── i18n/                      # Translation keys (en.json, es.json, useTranslation.js)
│   ├── lib/                       # locationData.js, db.js, entries.js
│   ├── pages/                     # Public client views (Home, Shop, Checkout, MyGarage, VipLounge...)
│   │   └── admin/                 # Admin CMS views (Dashboard, Products, Coupons, Giveaways, Users...)
│   └── stores/                    # Zustand state management (useAuthStore, useCartStore, useGiveawayStore...)
├── DEVELOPMENT.md                 # Design system tokens, color palettes & code conventions
├── package.json
└── vite.config.js
```

---

## 📡 API Contracts Reference

All requests and responses exchanged with the backend CodeIgniter 4 REST API follow strict JSON schemas documented under `/api-contracts/`:

* **`products.contract.json`** — Product catalog, variants, multipliers, and stock status.
* **`giveaways.contract.json`** — Active campaign metadata, CMS hero content, breakdown blocks, and scarcity banner.
* **`orders.contract.json`** — Order creation payload, line items, user details, and Stripe PaymentIntent token.
* **`coupons.contract.json`** — Coupon validation (`/api/coupons/validate`) and redemption (`/api/coupons/claim`).
* **`vip-polls.contract.json`** — VIP build voting polls, options, and vote submissions.

---

## 📦 Build, Test & Deployment

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server on `http://localhost:5173` |
| `npm run build` | Compile optimized production build into `dist/` |
| `npm run preview` | Serve and test production build locally |
| `npm run lint` | Run ESLint static syntax analysis |

### Production Deployment (cPanel / Apache)
1. Execute `npm run build` to compile the app into `/dist`.
2. Upload the contents of `dist/` to `public_html/`.
3. The included `public/.htaccess` file ensures SPA routing fallback (`index.html`) works seamlessly for all client-side routes.
