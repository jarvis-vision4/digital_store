# Shwe Family Digital Store — Backend

REST API for the Shwe Family Digital Store — a game top-up and digital product store (NestJS 11 + Prisma + MySQL). The Next.js frontend is served separately and talks to this API.

- Live API: `https://api.shwefamilydm.com`
- Swagger docs: `https://api.shwefamilydm.com/api/docs`

## Tech Stack

- [NestJS](https://nestjs.com) 11 — framework
- [Prisma](https://prisma.io) 6 — ORM (MySQL)
- [JWT](https://jwt.io) + Passport — authentication (`passport-jwt`)
- class-validator / class-transformer — DTO validation
- Multer — file uploads (game images, banner images, product images)
- `@nestjs/swagger` — OpenAPI docs

## Features

- **Auth**: register (with auto-rewarded referral bonus), login by email, profile, change password
- **Games**: public catalog with packages; admin CRUD with inline package creation; image upload
- **Digital products**: public list, admin CRUD with image upload and manual availability flag
- **Orders**: game top-up ordering, rating/reviews, admin deliver/cancel (refund)/delete
- **Digital orders**: separate flow (`digital_orders` table), pending → approve/reject (reject refunds wallet)
- **Wallet**: balance, transactions, deposit submission, coupon redeem, admin top-up approval & coupon generation
- **Settings**: banners (CRUD + image upload), global notice, payment accounts, security, Telegram bot settings
- **Telegram**: webhook, simulate, admin diagnostics
- **Admin**: user management, roles, referrals, rewards, statistics, audit logs

## Prerequisites

- Node.js 22+
- MySQL 8+

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env   # then fill in values (see Environment Variables)

# 3. Set up the database
npx prisma migrate dev
npx prisma generate

# 4. Run
npm run start:dev      # dev (watch mode)
npm run start:prod     # production
```

The API runs at `http://localhost:3000/api/v1` with Swagger docs at `http://localhost:3000/api/docs`.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string, e.g. `mysql://user:pass@localhost:3306/dbname` |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `PORT` | Server port (default `3000`) |

`.env` is gitignored — never commit real secrets.

## Scripts

```bash
npm run build       # compile to dist/
npm run start:dev   # dev watch mode
npm run start:prod  # run compiled dist/main.js
npm run lint        # eslint
npm run test        # jest unit tests
```

## API Overview

All routes are under `/api/v1`. Admin routes require a JWT with `ADMIN` or `MODERATOR` role (`Authorization: Bearer <token>`).

| Area | Public routes | Admin routes |
|---|---|---|
| Games | `GET /games`, `GET /games/:id` | `POST/PUT/DELETE /admin/games`, `POST /admin/games/upload` |
| Packages | — | `POST /admin/games/:id/packages`, `PUT /admin/packages/:id` |
| Digital products | `GET /digital-products` | `GET/POST/PUT /admin/digital-products(/:id)` |
| Digital orders | `POST /digital-orders`, `GET /digital-orders`, `POST /digital-products/:id/order` | `GET /admin/digital-orders`, `POST /admin/digital-orders/:id/{approve,reject}`, `DELETE /admin/digital-orders/:id` |
| Wallet | `GET /wallet/balance`, `GET /wallet/transactions`, `POST /wallet/deposit`, `POST /wallet/coupons/redeem` | top-up approval, coupon generation |
| Settings | `GET /banners`, `GET /notice`, `GET /support`, `GET /settings/payment` | banners CRUD, settings updates, statistics, audit logs |
| Auth | `POST /auth/register`, `POST /auth/login` | — |

File upload endpoints (games, banners, digital products) accept `multipart/form-data` with an `image` (or `file`) field; uploaded files are served under `/uploads/`.

Full interactive documentation: `/api/docs`.

## Deployment

### CI — `.github/workflows/ci.yml`

Runs on every push/PR to `main`: install → `prisma generate` → lint → build.

### CD — `.github/workflows/deploy.yml`

On push to `main`:

1. **Build** (on the VPS, in `/var/www/shwefamilydm`): `git reset --hard origin/main` → `npm ci` → `prisma generate` → `prisma migrate deploy` → `npm run build`. Any failure aborts the deployment.
2. **Restart** pm2 process `shwefamilydm-api`.
3. **Health check**: polls `https://api.shwefamilydm.com/api/docs` for `200` (12 attempts, 5s apart) — fails the run if the API doesn't come back up.

#### Required GitHub secrets

| Secret | Value |
|---|---|
| `VPS_HOST` | VPS IP, e.g. `64.120.92.134` |
| `VPS_USER` | SSH user (e.g. `root`) |
| `VPS_PORT` | SSH port (default `22`) |
| `VPS_SSH_KEY` | Private SSH key (deploy key added to the VPS `authorized_keys`) |

The production `.env` lives on the server at `/var/www/shwefamilydm/.env` (not in version control). The server uses pm2 (`digital-store-backend` / `shwefamilydm-api`) with nginx terminating TLS for `api.shwefamilydm.com` and proxying to the app port.

## Project Structure

```
src/
├── auth/             # register, login, JWT, profile, referrals
├── admin/            # user management, roles, rewards
├── games/            # games, packages, digital products, uploads
├── orders/           # game top-up orders, reviews
├── digital-orders/   # digital product order flow
├── wallet/           # balance, deposits, coupons
├── settings/         # banners, notice, payment/security settings
├── telegram/         # telegram bot webhook
├── common/           # guards, decorators, filters, multer config
└── prisma/           # PrismaService
prisma/
├── schema.prisma     # data model
└── migrations/       # SQL migrations
```
