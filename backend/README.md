# BORDERBUILT — Backend REST API Engine (CodeIgniter 4)

> 🏎️ **BORDERBUILT REST API Engine** — High-performance CodeIgniter 4 backend powering the binational automotive e-commerce and sweepstakes platform (Juárez 🇲🇽 / El Paso 🇺🇸).

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Version](https://img.shields.io/badge/version-1.3.0-blue)
![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4)
![CodeIgniter](https://img.shields.io/badge/CodeIgniter-4.5-EF4223)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![Stripe](https://img.shields.io/badge/Stripe-API-008CDD)

---

## 📋 Table of Contents
1. [Architecture & Tech Stack](#-architecture--tech-stack)
2. [Quick Start & Installation](#-quick-start--installation)
3. [Environment Configuration (`.env`)](#-environment-configuration-env)
4. [Exhaustive REST API Endpoint Directory](#-exhaustive-rest-api-endpoint-directory)
   - [Public Store & Catalog Endpoints](#-public-store--catalog-endpoints)
   - [Orders & Stripe Payment Endpoints](#-orders--stripe-payment-endpoints)
   - [Coupons & Promotional Endpoints](#-coupons--promotional-endpoints)
   - [VIP Lounge & Polls Endpoints](#-vip-lounge--polls-endpoints)
   - [Winners & Community Endpoints](#-winners--community-endpoints)
   - [Admin Panel Management Endpoints](#-admin-panel-management-endpoints)
5. [Database Schema & Migrations](#-database-schema--migrations)
6. [Database Seeders & Tools](#-database-seeders--tools)
7. [Unit Testing & Spark CLI Commands](#-unit-testing--spark-cli-commands)

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | CodeIgniter 4.5+ | PHP 8.2+ RESTful Architecture |
| **Database** | MySQL 8.0 / MariaDB | Relational schema with foreign key constraints |
| **Server Engine** | Apache / Laragon / PHP Spark | Local dev on port 8080 or Laragon virtual host |
| **Payment Gateway** | Stripe API v1 | PaymentIntents API with automatic currency handling |
| **CORS & Filters** | CI4 Filters | Custom CORS filter allowing cross-origin requests (`GET, POST, OPTIONS, PUT, PATCH, DELETE`) |
| **Testing Engine** | PHPUnit 10 | Automated unit tests for models and coupon engines |

### CodeIgniter Namespace Structure
All API controllers are cleanly isolated under the `App\Controllers\Api` namespace:
* `ProductController.php` — Public catalog & variant query engine.
* `GiveawayController.php` — Active campaign data & CMS hero content output.
* `OrderController.php` — Order creation, stock deduction, entry crediting & Stripe integration.
* `CouponController.php` — Discount validation and promotional entry redemptions.
* `VipPollController.php` — VIP poll voting controller.
* `WinnerController.php` — Past winners & community showcase API.
* `AdminController.php` & `Admin*Controllers` — Full administrative CRUD suite.

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/gruizmetasolutions-cpu/borderapp-api.git
cd borderapp-api
composer install
```

### 2. Configure Environment
Copy `env` to `.env` and set your local database credentials:
```bash
cp env .env
```

### 3. Initialize Database & Seed Initial Data
```bash
# Execute all database schema migrations
php spark migrate

# Seed initial admin user, products, giveaways, winners & configs
php spark db:seed InitialDataSeeder

# Seed initial discount & promotional coupons
php spark db:seed CouponSeeder
```

### 4. Run Development API Server
```bash
php spark serve --port 8080
# → Base API Endpoint: http://localhost:8080/api
```

---

## ⚙️ Environment Configuration (`.env`)

```env
# Environment Mode
CI_ENVIRONMENT = development

# Base Application URL
app.baseURL = 'http://localhost:8080/'

# Database Configuration
database.default.hostname = localhost
database.default.database = borderapp_dev
database.default.username = root
database.default.password = 
database.default.DBDriver = MySQLi
database.default.DBPrefix = 
database.default.port = 3306

# Stripe Secret API Key (Test/Live)
STRIPE_SECRET_KEY = sk_test_...
```

---

## 📡 Exhaustive REST API Endpoint Directory

### 🛒 Public Store & Catalog Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get active product catalog with variants, stock, and multipliers |
| `GET` | `/api/products/{id}` | Get specific product details by ID or slug |
| `GET` | `/api/giveaways/active` | Get active giveaway campaign details, countdown, hero CMS data, specs, and breakdown blocks |

### 💳 Orders & Stripe Payment Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create purchase order, validate stock, compute user entries, apply discount coupons, and generate Stripe PaymentIntent |
| `GET` | `/api/orders/user/{userId}` | Get complete order history for a specific user |
| `GET` | `/api/users/{id}` | Get user profile data, total spent, and total entries accumulated |

### 🎟️ Coupons & Promotional Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/coupons/validate` | Validate a discount coupon code at checkout (returns `%` or `$` discount) |
| `POST` | `/api/coupons/claim` | Redeem a promotional entry coupon code directly to the user's garage balance |

### 🗳️ VIP Lounge & Polls Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/vip/polls` | List active and past VIP build polls with option vote counts |
| `POST` | `/api/vip/polls/{id}/vote` | Cast user vote for a specific poll option (VIP members only) |

### 🏆 Winners & Community Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/winners` | Get list of past giveaway winners with car details, photos, and entry counts |
| `GET` | `/api/community-highlights` | Get community event showcase photos and tuner builds |

### 🛡️ Admin Panel Management Endpoints (`/api/admin/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Get high-level KPI metrics (Total Revenue, Entries Sold, Active Campaign, Sales Chart) |
| `GET` | `/api/admin/products` | List all catalog products including draft/inactive items |
| `POST` | `/api/admin/products` | Create a new product in the catalog |
| `PUT` | `/api/admin/products/{id}` | Update existing product details, price, multipliers, or tags |
| `DELETE` | `/api/admin/products/{id}` | Remove a product from the catalog |
| `GET` | `/api/admin/orders` | List all client purchase orders with filter parameters |
| `PUT` | `/api/admin/orders/{id}` | Update order fulfillment status (`pending`, `completed`, `shipped`, `cancelled`) |
| `GET` | `/api/admin/users` | List registered user accounts |
| `PUT` | `/api/admin/users/{id}/vip` | Toggle user VIP membership status (`is_vip = 1/0`) |
| `GET` | `/api/admin/giveaways` | List all giveaway campaigns |
| `POST` | `/api/admin/giveaways` | Create a new giveaway campaign |
| `PUT` | `/api/admin/giveaways/{id}/home-content` | Update Home CMS marketing data (Hero headline, subtitle, specs, breakdown blocks, scarcity banner) |
| `POST` | `/api/admin/giveaways/{id}/upload` | Upload hero or spec sheet images to server storage |
| `GET` | `/api/admin/coupons` | List all discount and entries coupons with redemption analytics |
| `POST` | `/api/admin/coupons` | Create a new coupon code (Set type: `discount`/`entries`, value, max uses, expiration) |
| `PUT` | `/api/admin/coupons/{id}` | Update coupon configuration or toggle active status |
| `DELETE` | `/api/admin/coupons/{id}` | Delete a coupon code |
| `GET` | `/api/admin/polls` | List VIP polls for administration |
| `POST` | `/api/admin/polls` | Create and publish a new VIP build poll |
| `GET` | `/api/admin/winners` | Manage winner records |
| `POST` | `/api/admin/winners` | Add a new giveaway winner record |
| `GET` | `/api/admin/community-highlights` | Manage community event showcase photos |
| `POST` | `/api/admin/community-highlights` | Upload and publish a community event photo |
| `GET` | `/api/admin/reports` | Export sweepstakes entries CSV audit file |
| `GET` | `/api/admin/config` | Retrieve global system settings |
| `PUT` | `/api/admin/config` | Update global settings (multiplier, FOMO banners, system defaults) |

---

## 🗄️ Database Schema & Migrations

The database consists of 12 relational tables managed via CodeIgniter 4 migrations (`app/Database/Migrations/`):

1. **`users`** — User accounts, roles (`admin`, `user`), total spent, accumulated entries, VIP flag (`is_vip`), location data.
2. **`products`** — Store items, category, price, compare price, `images` (JSON array), `tags` (JSON array), `has_multiplier`, `entry_multiplier`, `featured`.
3. **`product_variants`** — Product sizes (S, M, L, XL, etc.), colors, and stock quantities.
4. **`giveaways`** — Campaign dates, active multiplier, prize cost, average margin, status, and full Home CMS content (hero image, specs, breakdown blocks JSON, scarcity banner).
5. **`orders`** — Orders placed, total amount, entries earned, status, Stripe payment ID, shipping profile.
6. **`order_items`** — Order line items, product ID, variant size/color, price, quantity, and entries earned.
7. **`coupons`** — Promotional discount and entry codes, type (`discount_percent`, `discount_fixed`, `entries`), reward value, code, max uses, current uses, expiration date.
8. **`coupon_usage`** — Log of user redemptions to prevent double claims.
9. **`configs`** — System settings key-value store (e.g., `global_multiplier`, `fomo_banner_enabled`).
10. **`vip_polls`** — Build poll titles, description, active status, and end date.
11. **`vip_poll_options`** — Options for each poll, image URL, vote count.
12. **`vip_poll_votes`** — User vote records enforcing 1 vote per user per poll.
13. **`winners`** — Historical giveaway winners, car awarded, location, photo, entry count.
14. **`community_highlights`** — Event photos, tuner build showcase, location, link URL.

---

## 🌱 Database Seeders & Tools

```bash
# Seed complete initial dataset (Admin user, Products, Variants, R34 Giveaway campaign, Winners, Configs)
php spark db:seed InitialDataSeeder

# Seed coupon system datasets (PERCENT20, FREESHIP, ENTRYBOMB, VIP5000)
php spark db:seed CouponSeeder
```

---

## 🧪 Unit Testing & Maintenance Commands

```bash
# Run automated PHPUnit test suite
vendor/bin/phpunit

# Clear CodeIgniter application cache
php spark cache:clear

# List all registered application routes
php spark routes
```
