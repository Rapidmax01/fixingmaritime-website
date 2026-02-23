# Claude Memory File - Fixing Maritime Website

## Project Overview
Full-featured maritime services website with admin CMS, built with Next.js 14.2.5, TypeScript, Prisma 5, and Google Cloud PostgreSQL. Includes customer portal, admin dashboard, messaging system, invoice management, and Stripe payment integration (partial).

## Quick Start Commands
```bash
# Start development server
npm run dev                    # Runs on http://localhost:3001

# Database commands
npm run db:generate            # Generate Prisma client
npm run db:push                # Push schema to database
npm run db:studio              # Open Prisma Studio GUI
npm run db:migrate             # Run migrations

# Build & lint
npm run build                  # Production build
npm run lint                   # ESLint check

# Database reset (if needed)
npx prisma db push --force-reset

# Check if server is running
ps aux | grep "npm\|node" | grep -v grep
```

## Important URLs
- **Local Website**: http://localhost:3001
- **Local Admin**: http://localhost:3001/admin
- **Production**: https://www.fixingmaritime.com

## Admin Credentials
### Local Development (Demo Mode)
- Demo login only works when `NODE_ENV=development` AND database is unavailable
- Email: `admin@fixingmaritime.com`
- Password: `admin123`

### Production
- Email: `admin@fixingmaritime.com`
- Password: `Penroof211@`

---

## Tech Stack
- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Prisma 5.22 + Google Cloud PostgreSQL
- **Auth**: NextAuth 4.24 (customers, Google OAuth) + Custom JWT (admins)
- **UI**: Tailwind CSS, Headless UI, Framer Motion, Lucide icons, Heroicons
- **State**: React Query (TanStack), Zustand, ContentContext
- **Email**: Brevo HTTP API (transactional emails)
- **Payments**: Stripe (partially integrated, currently disabled)
- **Analytics**: Google Analytics (GA4)
- **DNS/Email Routing**: Cloudflare (MX -> Cloudflare Email Routing -> fixmaritime@gmail.com)
- **Deployment**: Vercel

---

## Email System
- **Provider**: Brevo HTTP API (`https://api.brevo.com/v3/smtp/email`)
- **Sender**: `Fixing Maritime <admin@fixingmaritime.com>` (verified in Brevo with DKIM + DMARC)
- **Admin notifications**: Sent to `fixmaritime@gmail.com`
- **Incoming email**: All `*@fixingmaritime.com` routed via Cloudflare catch-all to `fixmaritime@gmail.com`
- **Public-facing emails**: Display `info@fixingmaritime.com`, `support@fixingmaritime.com` etc. (all route to fixmaritime@gmail.com)
- **Free tier**: 300 emails/day

### DNS Records (Cloudflare)
- **MX**: route1/2/3.mx.cloudflare.net (Cloudflare Email Routing)
- **SPF**: `v=spf1 include:_spf.mx.cloudflare.net -all`
- **DMARC**: `v=DMARC1; p=none; rua=mailto:admin@fixingmaritime.com`
- **A record**: `76.76.21.21` (Vercel)
- **CNAME www**: Vercel DNS

---

## Google OAuth
- **Client ID**: `111903154251-g4e39rv729m1bb83p2bu70ba2iqe5iud.apps.googleusercontent.com`
- **Redirect URIs**: `https://www.fixingmaritime.com/api/auth/callback/google`, `http://localhost:3001/api/auth/callback/google`
- **Flow**: signIn callback in `lib/auth.ts` creates/links users in DB, sets `emailVerified: true`
- **Password field**: Optional (`String?`) in schema to support OAuth users without passwords
- **Google button**: Present on both `/login` and `/signup` pages

---

## Project Structure

### Public Pages (`/app/`)
| Route | Description |
|-------|-------------|
| `/` | Home page (Hero, ServiceCarousel, Features, Stats, Testimonials, CTA) |
| `/about` | About Us |
| `/services` | Services listing |
| `/services/[id]` | Individual service detail |
| `/contact` | Contact form |
| `/faq` | General FAQ |
| `/maritime-faq` | Maritime-specific FAQ |
| `/maritime-logistics` | Maritime logistics info |
| `/custom-clearing` | Custom clearing services |
| `/tug-barge-services` | Tug boat & barge services |
| `/partner-with-us` | Partner opportunities |
| `/partners` | Partners listing |
| `/careers` | Career opportunities |
| `/press` | Press releases |
| `/support` | Help center |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/track` | Order/shipment tracking |

### Customer Portal (Protected)
| Route | Description |
|-------|-------------|
| `/login` | Customer login (credentials + Google OAuth) |
| `/signup` | Customer registration (credentials + Google OAuth) |
| `/verify-email` | Email verification |
| `/forgot-password` | Password reset |
| `/dashboard` | Customer dashboard |
| `/orders` | Order management |
| `/invoices` | Invoice viewing |
| `/cart` | Shopping cart |
| `/checkout` | Stripe checkout |
| `/request-truck` | Request truck services |
| `/register-truck` | Truck driver registration |
| `/partner-registration` | Business partner registration |

### Admin Pages (`/app/admin/`)
| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard |
| `/admin/login` | Admin login |
| `/admin/content` | CMS - 9 editable sections |
| `/admin/services` | Services CRUD management |
| `/admin/inbox` | Customer messaging with file attachments |
| `/admin/quotes` | Quote request management |
| `/admin/invoices` | Invoice management & generation |
| `/admin/orders` | Order management |
| `/admin/analytics` | Website analytics & metrics |
| `/admin/users` | User management |
| `/admin/users/create-admin` | Create admin accounts |
| `/admin/admins` | Admin users list |
| `/admin/contacts` | Contact form submissions |
| `/admin/truck-registrations` | Truck driver approvals |
| `/admin/partner-registrations` | Partner application approvals |
| `/admin/truck-requests` | Truck service requests |
| `/admin/settings` | System settings |
| `/admin/profile` | Admin profile management |

---

## API Routes (`/app/api/`)

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/check-verification` - Check verification status
- `POST /api/auth/resend-verification` - Resend verification
- `GET|POST /api/auth/[...nextauth]` - NextAuth handlers (credentials + Google OAuth)

### Admin Auth
- `POST /api/admin/auth/login` - Admin login (demo mode: dev only + no DB)
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Current admin info
- `GET /api/admin/auth/status` - Auth status
- `POST /api/admin/auth/change-password` - Change password
- `GET|POST /api/admin/auth/profile` - Profile management

### Content Management
- `GET /api/content` - Public content (force-dynamic)
- `GET|POST /api/admin/content/sections` - Content sections CRUD
- `POST /api/admin/content/seo` - SEO settings
- `GET|POST /api/admin/content/media` - Media management
- `DELETE /api/admin/content/media/[id]` - Delete media

### Services
- `GET /api/services` - List services (public)
- `GET|POST|DELETE /api/admin/services` - Admin CRUD
- `GET|PUT|DELETE /api/admin/services/[id]` - Individual service
- `POST /api/admin/services/seed` - Seed services

### User Management
- `GET /api/users` - Public user info
- `GET|POST|DELETE /api/admin/users` - User CRUD
- `GET|PUT|DELETE /api/admin/users/[id]` - Individual user
- `PATCH /api/admin/users/[id]/status` - Update status
- `POST /api/admin/users/create-admin` - Create admin
- `POST /api/admin/users/make-admin` / `remove-admin` - Toggle admin role

### Messaging
- `GET|POST /api/messages` - Customer-admin messaging
- `POST /api/messages/upload` - File attachment uploads

### Contact
- `GET|POST /api/contact` - Contact form
- `GET|PUT|DELETE /api/contact/[id]` - Individual contact

### Quote Requests
- `GET|POST /api/quote-requests` - Quote submissions
- `GET|PUT|DELETE /api/admin/quote-requests/[id]` - Admin management
- `POST /api/quote-requests/claim` - Claim quote

### Invoices
- `GET|POST /api/invoices` - Invoice listing
- `GET|POST|DELETE /api/admin/invoices` - Admin CRUD
- `GET|PUT|DELETE /api/admin/invoices/[id]` - Individual invoice
- `POST /api/admin/invoices/generate-from-quote` - Generate from quote

### Orders & Tracking
- `GET|POST /api/orders` - Orders
- `GET|PUT|DELETE /api/orders/[id]` - Individual order
- `GET /api/orders/[id]/tracking` - Tracking info
- `POST /api/track` - Track shipment
- `POST /api/track-visit` - Track page visits

### Registrations
- `POST /api/truck-registration` - Truck driver registration
- `GET|POST|DELETE /api/admin/truck-registrations` - Admin management
- `POST /api/truck-request` - Customer truck request
- `GET|POST|DELETE /api/admin/truck-requests` - Admin management
- `POST /api/partner-registration` - Partner registration
- `GET|POST|DELETE /api/admin/partner-registrations` - Admin management

### Other
- `GET|POST /api/notifications` - Notifications
- `GET /api/admin/stats` - Dashboard stats (requires admin auth)
- `GET /api/admin/analytics` - Analytics data
- `POST /api/admin/create-first-admin` - Initialize first admin (requires ADMIN_CREATION_SECRET env var)
- `POST /api/create-payment-intent` - Stripe (currently disabled, returns "coming_soon")
- `GET /api/dashboard/stats` - Customer dashboard stats

---

## Database Schema (14 Models)

| Model | Table | Description |
|-------|-------|-------------|
| `User` | `app_users` | Users with email, password (optional for OAuth), role, company, phone, emailVerified |
| `Service` | `services` | Services with slug, name, description, features (JSON), active status |
| `ContentSection` | `content_sections` | 9 CMS sections (hero, about, services, contact, footer, story, mission, values, leadership) |
| `SeoSettings` | `seo_settings` | SEO metadata (title, description, keywords, OG tags) |
| `MediaFile` | `media_files` | Uploaded files with name, type, url, size, dimensions |
| `Message` | `messages` | Messaging with sender/receiver info, subject, content, attachments (JSON), threadId |
| `Invoice` | `invoices` | Invoices with invoiceNumber, customer info, items (JSON), amount, tax, status |
| `QuoteRequest` | `quote_requests` | Quotes with service, description, timeline, budget, status, quotedAmount |
| `Notification` | `notifications` | System notifications with type, message, status, email tracking |
| `TruckRegistration` | `truck_registrations` | Driver apps with truck details, insurance, license, specializations, status |
| `PartnerRegistration` | `partner_registrations` | Partner apps with company info, banking, documentation, status |
| `TruckRequest` | `truck_requests` | Truck service requests with pickup/delivery, cargo, urgency, tracking |
| `PageVisit` | `page_visits` | Analytics - page views with session, device, browser, location |

---

## Components (`/components/`)
- `AdminHeader.tsx` - Admin dashboard header/navigation
- `Header.tsx` - Main site header/navigation
- `Footer.tsx` - Site footer
- `Hero.tsx` - Hero banner with rotating maritime backgrounds
- `ServiceCarousel.tsx` - Animated service carousel
- `Services.tsx` - Services display grid
- `Features.tsx` - Features showcase section
- `Stats.tsx` - Statistics counters
- `Testimonials.tsx` - Customer testimonials
- `CTA.tsx` - Call-to-action section
- `ConditionalLayout.tsx` - Layout wrapper (shows header/footer conditionally)
- `AuthLink.tsx` - Auth-aware navigation links
- `DatabaseStatus.tsx` - Database connection status indicator
- `DynamicHead.tsx` - Dynamic meta tag management
- `GoogleAnalytics.tsx` - GA4 integration
- `PageTracker.tsx` - Page visit tracking
- `QuoteClaimModal.tsx` - Quote claiming modal
- `StructuredData.tsx` - JSON-LD structured data for SEO

## Contexts (`/contexts/`)
- `ContentContext.tsx` - Global content state for 9 CMS sections + SEO settings, with fallback content

## Hooks (`/hooks/`)
- `useMessageNotifications.ts` - Real-time message notification polling
- `useRegistrationCounts.ts` - Registration count tracking

## Utility Libraries (`/lib/`)
- `admin-auth.ts` - Admin JWT authentication
- `auth.ts` - NextAuth config with Google OAuth signIn callback (no PrismaAdapter)
- `database.ts` - Prisma client singleton
- `database-wake.ts` - Database connection wake-up
- `email-service.ts` - Brevo HTTP API email service (notifications, contact forms, quotes)
- `email.ts` - Brevo HTTP API for auth emails (verification, password reset)
- `invoice-service.ts` - Invoice generation
- `notification-service.ts` - Notification handling
- `seo-utils.ts` - SEO helpers
- `temp-email-store.ts` - Temporary email storage
- `tracking-service.ts` - Order/package tracking

---

## Authentication System (Dual)

**Customer Auth (NextAuth.js):**
- Credentials provider (email/password)
- Google OAuth (auto-creates users, sets emailVerified=true)
- JWT session strategy (no PrismaAdapter - custom signIn callback handles DB)
- Protected routes: `/dashboard`, `/orders`, `/account`

**Admin Auth (Custom JWT):**
- Custom JWT token generation via `/api/admin/auth/login`
- Demo mode: only in development + when DB unavailable
- No hardcoded fallback secrets
- All admin API endpoints require `admin-token` cookie

---

## Environment Variables

### Required (Production)
- `DATABASE_URL` - Google Cloud PostgreSQL connection string
- `NEXTAUTH_SECRET` - JWT secret (no fallback - must be set)
- `BREVO_API_KEY` - Brevo transactional email API key
- `BREVO_SENDER_EMAIL` - Verified sender (admin@fixingmaritime.com)

### Required (Google OAuth)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Optional
- `NEXTAUTH_URL` - Auth callback URL (defaults to https://www.fixingmaritime.com)
- `ADMIN_CREATION_SECRET` - Required to use `/api/admin/create-first-admin`
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` - Stripe payments
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` - Google Search Console

### Deprecated (removed)
- ~~`GMAIL_USER`~~ - Replaced by BREVO_API_KEY
- ~~`GMAIL_APP_PASSWORD`~~ - Replaced by BREVO_API_KEY
- ~~Supabase env vars~~ - Migrated to Google Cloud PostgreSQL

---

## Middleware (`middleware.ts`)
- NextAuth-based route protection
- Protected: `/dashboard`, `/orders`, `/account`
- Public: `/`, `/login`, `/signup`, `/about`, `/services`, `/contact`, `/track`
- All `/api/` routes allowed

## Config Files
- `next.config.js` - Image optimization (Unsplash, fixingmaritime.com), security headers, compression
- `tailwind.config.ts` - Custom sky blue/navy palette, gradient utilities
- `tsconfig.json` - Strict mode, `@/*` path alias
- `postcss.config.js` - Tailwind + Autoprefixer

---

## Key Systems Status

### Content Management ✅
- 9 editable sections via `/admin/content`
- Dynamic rendering from database with fallback content

### Messaging System ✅
- Bidirectional customer-admin messaging
- File attachments (PDF, DOC, XLS, TXT, images, 10MB max)
- Shared admin inbox - all admins see all messages
- Email notifications via Brevo to fixmaritime@gmail.com
- Thread support with parent message tracking
- Unread message count with polling

### Services Management ✅
- Full CRUD via `/admin/services`
- Service detail pages at `/services/[id]`
- Seed functionality for initial data

### Invoice System ✅
- Invoice generation from quotes
- Customer invoice viewing
- Admin CRUD management

### Registration Systems ✅
- Truck driver registration & admin approval
- Partner registration & admin approval
- Truck service requests with tracking

### Analytics ✅
- Page visit tracking (`page_visits` table)
- Admin analytics dashboard
- Google Analytics integration

### Google OAuth ✅
- Sign in and sign up with Google
- Auto user creation with emailVerified=true
- Works on both login and signup pages

### Email System ✅
- Brevo HTTP API (replaced Gmail SMTP)
- Verified sender: admin@fixingmaritime.com
- Cloudflare Email Routing catch-all -> fixmaritime@gmail.com

### Payments (Partial)
- Stripe integration exists but is disabled
- `/api/create-payment-intent` returns "coming_soon"
- Cart and checkout UI are built

---

## Security Notes
- Demo admin credentials restricted to development mode + no database only
- No hardcoded fallback secrets (NEXTAUTH_SECRET, ADMIN_CREATION_SECRET required)
- Admin stats endpoint requires authentication
- Admin creation endpoint requires ADMIN_CREATION_SECRET env var
- Password field is optional in schema (supports OAuth users)

## Deployment
- **Platform**: Vercel
- **Database**: Google Cloud PostgreSQL (`35.192.22.45:5432/maritime`)
- **Email**: Brevo HTTP API (admin@fixingmaritime.com)
- **DNS**: Cloudflare (fixingmaritime.com)
- Set env vars in Vercel dashboard
- Always test admin login, Google OAuth, and email after deployment

## Utility Scripts (`/scripts/`)
- `create-admin-user.js` - Create admin user
- `make-admin.js` - Convert user to admin
- `seed-content.js` - Seed content sections
- `fix-database-schema.js` - Fix schema issues
- `import-to-gcloud-sql.js` - Import to Google Cloud SQL

## Team
- **CEO & Founder**: Raphael Ugochukwu U.
- **Head of Technology**: Maximus U.

## Testing Checklist
- [ ] Local server starts on port 3001
- [ ] Admin login works (production credentials)
- [ ] Google OAuth sign-in and sign-up works
- [ ] Content changes in admin reflect on site
- [ ] All 9 content sections visible in admin
- [ ] Database connection working
- [ ] Messaging: send, receive, attachments, email notifications
- [ ] Services: add, edit, delete, view, toggle status
- [ ] Invoices: create, view, generate from quote
- [ ] Registrations: truck, partner, truck requests
- [ ] Analytics: page tracking working
- [ ] Quote requests: submit, claim, respond
- [ ] Email delivery via Brevo working

---
*Last updated: February 23, 2026*
*Database: Google Cloud PostgreSQL (35.192.22.45)*
*Email: Brevo API (admin@fixingmaritime.com)*
*DNS: Cloudflare (fixingmaritime.com)*
