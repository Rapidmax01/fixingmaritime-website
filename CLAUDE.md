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

### Content Management System
- **9 Editable Sections**: Hero, About, Services, Contact, Footer, Our Story, Mission Statement, Our Values, Leadership Team
- All content is stored in database and dynamically rendered
- Admin can edit all sections from `/admin/content`

### Critical Files
- `/app/api/content/route.ts` - Public content API (has `export const dynamic = 'force-dynamic'`)
- `/app/admin/content/page.tsx` - Admin content management interface
- `/contexts/ContentContext.tsx` - Content state management
- `prisma/schema.prisma` - Database schema

### Environment Setup
- `.env.local` is gitignored for security
- See `ENVIRONMENT_SETUP.md` for Vercel environment variables
- Local development falls back to demo mode if no database connection

### Recent Issues Resolved
1. **Static Generation Problem**: Fixed by adding `export const dynamic = 'force-dynamic'` to content API
2. **Database Connection Issues**: Resolved Supabase RLS permissions and formatting
3. **Environment Variables**: Removed .env.local from git tracking for security
4. **Missing Content Sections**: Added 4 new sections (Story, Mission, Values, Leadership) to database

## Database Schema Key Tables
- `content_sections` - Website content (9 sections)
- `app_users` - User accounts and admin roles
- `orders` - Order management
- `media` - File uploads

## Deployment Notes
- Deployed on Vercel
- Working deployment ID: `Cn86BhJ3Q` (reference point)
- Environment variables must be set in Vercel dashboard
- Always test admin login after deployment

## Testing Checklist
- [ ] Local server starts on port 3001
- [ ] Admin login works (both demo and production credentials)
- [ ] Content changes in admin reflect on main site
- [ ] All 9 content sections visible in admin panel
- [ ] Database connection working

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
- **Database Integration**: Prisma + Supabase with proper error handling
- **Service Status Toggle**: Working activate/deactivate functionality
- **Seed Functionality**: Auto-populate database with initial services
- **Add Service Modal**: Complete form with validation and dynamic features
- **Edit Service Modal**: Pre-populated form for service updates
- **Delete Service Modal**: Confirmation dialog with database deletion
- **View Service Modal**: Detailed service information display
- **All Buttons Active**: Add, Edit, Delete, View actions fully functional

## Next Steps / TODO
- Service ordering capability for customers
- Individual service detail pages
- Analytics dashboard implementation
- Performance optimizations

---
*Last updated: August 22, 2025*
*Local server status: Running on port 3001*
*Services system: Fully functional ✅*