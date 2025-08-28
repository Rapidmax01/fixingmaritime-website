# Claude Memory File - Fixing Maritime Website

## Project Overview
Full-featured maritime services website with admin CMS, built with Next.js 14, TypeScript, Prisma, and Supabase.

## Quick Start Commands
```bash
# Start development server
npm run dev
# Server runs on: http://localhost:3001

# Database commands
npx prisma generate
npx prisma db push
```

## Important URLs
- **Local Website**: http://localhost:3001
- **Local Admin**: http://localhost:3001/admin
- **Production**: https://www.fixingmaritime.com

## Admin Credentials
### Local Development (Demo Mode)
- Email: `admin@fixingmaritime.com`
- Password: `admin123`

### Production
- Email: `admin@fixingmaritime.com`
- Password: `Penroof211@`

## Key Technical Details

### Messaging System ✅
- **Customer-Admin Communication**: Real-time messaging between customers and admins
- **File Attachments**: Support for PDF, DOC, XLS, TXT, and image uploads (10MB max)
- **Admin Visibility**: ALL admin users see ALL customer messages in shared inbox
- **Email Notifications**: Customer messages automatically notify raphael@fixingmaritime.com and admin@fixingmaritime.com
- **Database**: Messages stored in `messages` table with JSON attachments field
- **API Endpoints**: `/api/messages`, `/api/messages/upload`, `/api/users`

### Content Management System
- **9 Editable Sections**: Hero, About, Services, Contact, Footer, Our Story, Mission Statement, Our Values, Leadership Team
- All content is stored in database and dynamically rendered
- Admin can edit all sections from `/admin/content`

### Critical Files
- `/app/api/content/route.ts` - Public content API (has `export const dynamic = 'force-dynamic'`)
- `/app/admin/content/page.tsx` - Admin content management interface
- `/app/admin/inbox/page.tsx` - Admin messaging interface with file attachments
- `/app/api/messages/route.ts` - Messaging API with email notifications
- `/app/api/messages/upload/route.ts` - File upload API for attachments
- `/contexts/ContentContext.tsx` - Content state management
- `/lib/email-service.ts` - Email notifications for messages
- `prisma/schema.prisma` - Database schema

### Environment Setup
- `.env.local` is gitignored for security
- See `ENVIRONMENT_SETUP.md` for Vercel environment variables
- Local development falls back to demo mode if no database connection
- **Production Database**: Google Cloud PostgreSQL at `35.192.22.45:5432/maritime`
- **Email Service**: Gmail SMTP for message notifications (GMAIL_USER, GMAIL_APP_PASSWORD required)

### Recent Issues Resolved
1. **Static Generation Problem**: Fixed by adding `export const dynamic = 'force-dynamic'` to content API
2. **Database Connection Issues**: Resolved Supabase RLS permissions and formatting
3. **Environment Variables**: Removed .env.local from git tracking for security
4. **Missing Content Sections**: Added 4 new sections (Story, Mission, Values, Leadership) to database
5. **Messaging System Issues**: Fixed admin authentication and database lookup errors
6. **Email Notifications**: Added automatic email alerts for new customer messages
7. **File Attachments**: Implemented complete attachment system with upload and download

## Database Schema Key Tables
- `content_sections` - Website content (9 sections)
- `app_users` - User accounts and admin roles
- `messages` - Customer-admin messaging with attachments (JSON field)
- `media_files` - File uploads and message attachments
- `services` - Service offerings management
- `quote_requests` - Customer quote submissions
- `notifications` - System notifications
- `truck_registrations` - Truck driver registrations
- `partner_registrations` - Business partner applications
- `truck_requests` - Customer truck service requests

## Deployment Notes
- Deployed on Vercel
- Working deployment ID: `Cn86BhJ3Q` (reference point)
- **Database**: Google Cloud PostgreSQL (`35.192.22.45:5432/maritime`)
- Environment variables must be set in Vercel dashboard:
  - `DATABASE_URL` - Google Cloud connection string
  - `GMAIL_USER` & `GMAIL_APP_PASSWORD` - For message email notifications
  - `NEXTAUTH_SECRET` - JWT secret for authentication
- Always test admin login and messaging after deployment

## Testing Checklist
- [ ] Local server starts on port 3001
- [ ] Admin login works (both demo and production credentials)
- [ ] Content changes in admin reflect on main site
- [ ] All 9 content sections visible in admin panel
- [ ] Database connection working
- [ ] **Messaging System**:
  - [ ] Customer can send messages from dashboard inbox
  - [ ] Messages appear in ALL admin inboxes 
  - [ ] File attachments upload and download properly
  - [ ] Email notifications sent to raphael@fixingmaritime.com and admin@fixingmaritime.com
  - [ ] Admin can reply to customer messages
  - [ ] Unread message count shows correctly

## Common Commands
```bash
# Check if server is running
ps aux | grep "npm\|node" | grep -v grep

# Database reset (if needed)
npx prisma db push --force-reset

# Build for production
npm run build
```

## Team
- **CEO & Founder**: Raphael Ugochukwu U.
- **Head of Technology**: Maximus U.

## Recent Accomplishments ✅
- **Services Management System**: Fully implemented with database connectivity
- **Admin Services Page**: `/admin/services` - Complete CRUD operations 
- **Service API Routes**: Full REST API for services management
- **Database Integration**: Prisma + Google Cloud PostgreSQL with proper error handling
- **Service Status Toggle**: Working activate/deactivate functionality
- **Seed Functionality**: Auto-populate database with initial services
- **Add Service Modal**: Complete form with validation and dynamic features
- **Edit Service Modal**: Pre-populated form for service updates
- **Delete Service Modal**: Confirmation dialog with database deletion
- **View Service Modal**: Detailed service information display
- **All Buttons Active**: Add, Edit, Delete, View actions fully functional

## Messaging System Accomplishments ✅
- **Complete Messaging Infrastructure**: Customer-admin bidirectional messaging
- **File Attachment System**: Upload/download with 10MB limit, multiple file types
- **Shared Admin Inbox**: All admins see all customer messages
- **Email Integration**: Auto-notifications to raphael@fixingmaritime.com and admin@fixingmaritime.com
- **Real-time Notifications**: Unread message count with polling updates
- **Thread Support**: Reply functionality with parent message tracking
- **Database Schema**: Full `messages` table with attachments JSON field
- **Admin Authentication**: Dual auth system (NextAuth + JWT) with demo fallbacks

## Next Steps / TODO
- Service ordering capability for customers
- Individual service detail pages
- Analytics dashboard implementation
- Performance optimizations

---
*Last updated: August 28, 2025*
*Local server status: Running on port 3001*
*Services system: Fully functional ✅*
*Messaging system: Fully functional ✅*
*Database: Google Cloud PostgreSQL (35.192.22.45)*