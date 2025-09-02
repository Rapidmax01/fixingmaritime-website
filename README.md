# Fixing Maritime - Enterprise Maritime Services Platform

<div align="center">
  <img src="/public/logo.png" alt="Fixing Maritime Logo" width="120" height="120">
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)
  
  🌐 **Live:** [www.fixingmaritime.com](https://www.fixingmaritime.com)
</div>

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Security](#-security)
- [Recent Updates](#-recent-updates)
- [Contributing](#-contributing)

## 🌟 Overview

Fixing Maritime is a comprehensive enterprise platform for maritime logistics services, offering end-to-end solutions including truck services, customs clearance, freight forwarding, warehousing, and more. Built with modern web technologies, it features a powerful admin CMS, real-time messaging, invoice generation, and analytics.

**Business Registration:** MOGBASKI (NO. 3420894)

## 🚀 Features

### Customer Portal
- **🚛 Service Ordering**: Request trucks, tug boats, freight forwarding, and more
- **📊 Dashboard**: Track orders, invoices, and service history
- **💬 Real-time Messaging**: Direct communication with admin team
- **📄 Invoice Management**: View and download invoices
- **🔍 Order Tracking**: Real-time status updates
- **👤 User Profiles**: Manage account and preferences
- **📱 Mobile Responsive**: Optimized for all devices

### Service Offerings
- **Truck Services**: GPS-tracked ground transportation
- **Tug Boat & Barge**: Marine transportation services
- **Procurement**: Export goods sourcing
- **Freight Forwarding**: Global shipping solutions
- **Warehousing**: Climate-controlled storage
- **Custom Clearance**: Documentation and customs services

### Admin Dashboard
- **📝 Content Management System (CMS)**
  - 9 editable content sections
  - Real-time updates without code changes
  - Media library management
  - SEO optimization tools
  
- **👥 User Management**
  - Customer and partner management
  - Role-based access control
  - Admin privilege assignment
  - Activity monitoring
  
- **📈 Analytics Dashboard**
  - Real-time metrics and KPIs
  - User registration trends
  - Service usage statistics
  - Revenue tracking
  
- **💼 Business Operations**
  - Order management and tracking
  - Quote generation and management
  - Invoice creation and tracking
  - Partner/truck registration processing
  
- **💬 Communication Center**
  - Unified messaging inbox
  - File attachment support (10MB)
  - Email notifications
  - Message threading

### Technical Features
- **🔐 Dual Authentication**: NextAuth for customers, JWT for admins
- **📧 Email Verification**: Secure user registration
- **🎨 Dynamic UI**: Framer Motion animations
- **🎯 SEO Optimized**: Meta tags and structured data
- **⚡ Performance**: Optimized loading and caching
- **🌐 Internationalization Ready**: Expandable to multiple languages

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **ORM**: Prisma 5.17
- **Database**: PostgreSQL (Google Cloud SQL)
- **Storage**: Supabase
- **Authentication**: NextAuth.js + Custom JWT

### Infrastructure
- **Hosting**: Vercel
- **Database**: Google Cloud SQL (35.192.22.45)
- **Storage**: Supabase Storage
- **Email**: Gmail SMTP
- **DNS**: Configured for fixingmaritime.com

## 🏁 Getting Started

### Prerequisites
```bash
Node.js 18.0 or higher
npm or yarn
PostgreSQL database
Gmail account for SMTP
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Rapidmax01/fixingmaritime-website.git
cd fixingmaritime-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

Create `.env.local` in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3001"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Email Configuration
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-specific-password"

# Admin Configuration
ADMIN_SECRET_KEY="fixingmaritime2024admin"
```

4. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (optional)
npm run seed
```

5. **Run Development Server**
```bash
npm run dev
```

Access the application:
- 🌐 Website: http://localhost:3001
- 🔧 Admin: http://localhost:3001/admin

### Demo Credentials (Development)
- **Email**: admin@fixingmaritime.com
- **Password**: admin123

## 📁 Project Structure

```
fixingmaritime-website/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   └── [pages]/             # Public pages
├── components/              # Reusable React components
│   ├── admin/              # Admin-specific components
│   └── [shared]/           # Shared components
├── contexts/               # React Context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
│   ├── auth.ts            # Authentication utilities
│   ├── database.ts        # Database connection
│   └── email.ts           # Email service
├── prisma/                 # Database schema
│   └── schema.prisma      # Prisma schema file
├── public/                 # Static assets
├── scripts/                # Utility scripts
└── types/                  # TypeScript definitions
```

## 📡 API Documentation

### Authentication Endpoints

#### Customer Authentication (NextAuth)
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signin` - Process login
- `GET /api/auth/signout` - Sign out
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/verify-email` - Verify email address

#### Admin Authentication (JWT)
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/profile` - Get profile
- `PUT /api/admin/auth/profile` - Update profile
- `POST /api/admin/auth/change-password` - Change password
- `POST /api/admin/auth/logout` - Logout

### Content Management
```typescript
// Get all content sections
GET /api/content

// Update content section (Admin)
PUT /api/admin/content/sections
Body: {
  type: string,
  title: string,
  content: string,
  subtext?: string
}

// Upload media (Admin)
POST /api/admin/content/media
Form-data: file (max 50MB)
```

### Service Management
```typescript
// Public endpoints
GET /api/services - List all active services
GET /api/services/:id - Get service details

// Admin endpoints
GET /api/admin/services - List all services
POST /api/admin/services - Create service
PUT /api/admin/services/:id - Update service
DELETE /api/admin/services/:id - Delete service
```

### Messaging System
```typescript
// Get messages
GET /api/messages?type=inbox&status=unread

// Send message
POST /api/messages
Body: {
  receiverId: string,
  subject: string,
  content: string,
  attachments?: string[]
}

// Upload attachment
POST /api/messages/upload
Form-data: file (max 10MB)
```

### Order Management
```typescript
// Customer endpoints
GET /api/orders - List user orders
GET /api/orders/:id - Get order details
POST /api/quote-requests - Request quote

// Admin endpoints
GET /api/admin/orders - List all orders
PUT /api/admin/orders/:id - Update order
POST /api/admin/invoices/generate-from-quote - Generate invoice
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Vercel**
- Import repository to Vercel
- Add environment variables
- Deploy

### Production Environment Variables
See `ENVIRONMENT_SETUP.md` for complete production configuration.

### Database Migration
```bash
# Production migration
npx prisma migrate deploy

# Seed production data
NODE_ENV=production npm run seed
```

## 🔒 Security

### Security Features
- 🔐 Environment variables for sensitive data
- 🛡️ CSRF protection with NextAuth
- 🔑 Secure password hashing (bcrypt)
- 📧 Email verification for new accounts
- 🚪 Role-based access control (RBAC)
- 🔍 Input validation and sanitization
- 🌐 HTTPS enforced in production
- 📊 Rate limiting on API endpoints

### Security Best Practices
1. Never commit `.env.local` file
2. Rotate JWT secrets regularly
3. Use strong database passwords
4. Enable 2FA for admin accounts
5. Regular security audits
6. Keep dependencies updated

## 📅 Recent Updates

### September 2024
- ✅ Fixed login page duplicate function definitions
- ✅ Resolved React hydration errors
- ✅ Fixed Custom Clearance Agent card display issue
- ✅ Improved service carousel UX

### August 2024
- ✅ Implemented invoice generation system
- ✅ Added real-time analytics dashboard
- ✅ Enhanced messaging system with file attachments
- ✅ Deployed to Google Cloud SQL
- ✅ Added hero banner CMS integration

### Features Completed
- 🎯 Full CMS with 9 editable sections
- 💬 Real-time messaging with notifications
- 📊 Analytics with page visit tracking
- 🧾 Invoice generation from quotes
- 🎨 Service carousel with auto-advance
- 📱 Mobile-responsive design
- 🔐 Dual authentication system

## 🤝 Contributing

This is a proprietary project for MOGBASKI/Fixing Maritime. For internal contributors:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### Coding Standards
- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📞 Support

For technical support or inquiries:
- **Email**: admin@fixingmaritime.com
- **Phone**: +2349073989943
- **WhatsApp**: [+2349073989943](https://wa.me/2349073989943)

## 👥 Team

- **CEO & Founder**: Raphael Ugochukwu U.
- **Head of Technology**: Maximus U.
- **Development**: Rapidmax01

## 📄 License

This project is proprietary software owned by MOGBASKI (Business Registration NO. 3420894). All rights reserved.

---

<div align="center">
  Built with ❤️ by the Fixing Maritime Team
  <br>
  Powered by Next.js, Vercel, and Google Cloud
</div>