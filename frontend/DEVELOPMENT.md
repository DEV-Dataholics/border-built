# DEVELOPMENT.md — BORDERBUILT Frontend Architecture & Design System Guide

> Reference guide for visual identity, tech stack, state management, location presets, and code conventions for BORDERBUILT.

---

## 1. Project Overview

**BORDERBUILT** is a binational automotive lifestyle brand (Juárez / El Paso) operating on a Sweepstakes / Giveaway model.

- **Core Loop:** Users buy merchandise / digital bundles → Earn entries → Win modified JDM/Muscle cars.
- **Visual Vibe:** "Underground Tokyo at Night" meets cybernetic technical engineering.
- **Tagline:** "Two Cities. One Passion." / "Dos Ciudades. Una Pasión."

---

## 2. Tech Stack

| Layer            | Technology                     |
|------------------|--------------------------------|
| Framework        | Vite 7 + React 19              |
| Routing          | React Router 7                 |
| Styling          | Tailwind CSS 4 (`@theme`)      |
| Animation        | Framer Motion                  |
| State            | Zustand                        |
| Icons            | Material Symbols / Lucide      |
| Localization     | Custom i18n (`en.json`, `es.json`)|
| Backend          | CodeIgniter 4 REST API         |

---

## 3. Key Architecture & Modules

### 📍 Location Presets (`src/lib/locationData.js`)
Centralized location dropdown dataset supporting:
- 🇺🇸 **United States:** California, Texas, New Mexico, Arizona, etc. + major cities.
- 🇲🇽 **Mexico:** Chihuahua, CDMX, Nuevo León, Jalisco, etc. + major cities (Juárez, Chihuahua, El Paso region).
- 🇨🇦 **Canada:** Ontario, Quebec, British Columbia, etc.
- 🏁 **Other:** Open text input fallback.

Shared across `Checkout.jsx` and `AdminUsers.jsx` for consistent shipping profile inputs.

### 💳 Stripe Exclusive Checkout (`src/pages/Checkout.jsx`)
- Pure Stripe card payment UI with formatted card numbers (`4111 2222 3333 4444`).
- Auto-fill shipping information from user profile API (`GET /api/users/{id}`).
- Floating `"TU OPORTUNIDAD DE GANAR"` badge with unclipped overflow.
- Cart clear & thank-you confirmation step state guard preventing unintended redirects.

### 🎟️ Coupons System (`src/pages/admin/AdminCoupons.jsx` & `ClaimCoupon.jsx`)
- Dual-reward support: `entries` (free sweepstakes tickets) and `discount` (% off or $ off).
- Admin KPI analytics: Total coupons, used count, redemption rate (%), total entries gifted.
- Animated creation/edit modal powered by `framer-motion`.

### 🗳️ VIP Lounge & Polls (`src/pages/VipLounge.jsx` & `useVipPollStore.js`)
- Exclusive voting portal for VIP users.
- Live progress bar for option votes.
- Managed via `AdminPolls.jsx`.

---

## 4. Design System & Visual Identity

### Color Tokens

| Token             | Hex       | Usage                              |
|-------------------|-----------|-------------------------------------|
| `primary`         | `#6AF425` | Primary Cyberpunk Neon Green CTAs   |
| `primary-dim`     | `#4CAF50` | Hover states & secondary glows      |
| `accent`          | `#FF3B30` | Admin alerts & warning callouts     |
| `background-dark` | `#0A0A0A` | Main dark background                |
| `card-dark`       | `#111111` | Card surfaces & containers          |
| `border-dark`     | `#222222` | Borders & grid dividers             |

---

## 5. Code Conventions & Quality

1. **Linting:** Standard ESLint rules enforced. Run `npx eslint src/` before commits.
2. **State Scoping:** Shared state in Zustand (`src/stores/`), local UI state in `useState`.
3. **i18n:** All text wrapped in `t('key')` supporting English and Spanish.
4. **Git Workflow:** Feature branches (`feature/*`), commit, push, merge into `main` (Frontend) or `master` (Backend).
