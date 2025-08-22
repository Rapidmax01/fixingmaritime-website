# Fixing Maritime - Professional Maritime Services Website

A modern, full-featured website for Fixing Maritime, offering comprehensive maritime logistics solutions including documentation, freight forwarding, warehousing, and custom clearing services.

## 🚀 Features

### Public Website
- **Modern Landing Page** with dynamic content management
- **7 Core Maritime Services**: Documentation, Truck Services, Tug Boat & Barge, Procurement, Freight Forwarding, Warehousing, and Custom Clearing
- **Interactive Service Pages** with detailed information
- **About Page** with company story, mission, values, and leadership
- **Contact Page** with inquiry form
- **Order Tracking** system for customers
- **User Authentication** with email verification
- **Shopping Cart** and checkout functionality
- **Responsive Design** optimized for all devices

### Admin Dashboard (/admin)
- **Content Management System (CMS)**
  - Edit all website content sections
  - 9 editable sections: Hero, About, Services, Contact, Footer, Our Story, Mission Statement, Our Values, and Leadership Team
  - Real-time content updates
- **User Management** 
  - View and manage registered users
  - Assign/remove admin privileges
- **Order Management** with status tracking
- **Media Management** for images and files
- **SEO Settings** management
- **Analytics Dashboard** (coming soon)

### Technical Features
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Prisma ORM** with PostgreSQL
- **Supabase** for database and storage
- **NextAuth.js** for authentication
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **Responsive & Mobile-First** design

## 🛠 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (via Supabase)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rapidmax01/fixingmaritime-website.git
   cd fixingmaritime-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3001"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   
   # Email (optional)
   GMAIL_USER="your-email@gmail.com"
   GMAIL_APP_PASSWORD="your-app-password"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Website: http://localhost:3001
   - Admin: http://localhost:3001/admin

### Demo Admin Credentials (Development Only)
- Email: `admin@fixingmaritime.com`
- Password: `admin123`

## 📁 Project Structure

```
fixingmaritime-website/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   └── ...                # Other pages
├── components/            # React components
├── contexts/              # React contexts
├── lib/                   # Utility functions
├── prisma/                # Database schema
├── public/                # Static assets
└── scripts/               # Utility scripts
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Environment Variables Required**
   See `ENVIRONMENT_SETUP.md` for complete list of required environment variables.

### Production Database Setup

1. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

2. **Seed initial content**
   - Login to admin panel
   - Navigate to `/api/admin/content/migrate` (POST)
   - Or use the migration button in admin panel

## 🔧 Admin Features Guide

### Content Management
1. Login to `/admin`
2. Navigate to "Content Management"
3. Edit any of the 9 content sections:
   - **Hero Section** - Homepage banner
   - **About Us** - About page intro
   - **Services Overview** - Services description
   - **Contact Information** - Contact details
   - **Footer Content** - Footer text
   - **Our Story** - Company history
   - **Mission Statement** - Company mission
   - **Our Values** - Core values
   - **Leadership Team** - Team introduction

### User Management
1. Navigate to "User Management"
2. View all registered users
3. Make users admin or remove admin privileges
4. First admin must be created via API endpoint

### Creating First Admin
```bash
curl -X POST http://localhost:3001/api/admin/create-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "secretKey": "fixingmaritime2024admin"
  }'
```

## 📦 Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:migrate` - Run database migrations

## 🔒 Security

- Environment variables are not committed to git
- Admin routes are protected with authentication
- Email verification required for users
- Secure session management with JWT
- Input validation and sanitization
- HTTPS enforced in production

## 🌐 Live Website

Visit [https://www.fixingmaritime.com](https://www.fixingmaritime.com)

## 📧 Contact

For support or inquiries:
- Email: info@fixingmaritime.com
- Phone: +1 (555) 123-4567

## 👥 Team

- **CEO & Founder**: Raphael Ugochukwu U.
- **Head of Technology**: Maximus U.

## 📝 License

This project is private and proprietary to Fixing Maritime.

---

Built with ❤️ by Fixing Maritime Team | Powered by Next.js & Vercel