# Supabase Database Setup Guide

Follow these steps to set up your Supabase database for the Fixing Maritime website.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up for a free account
3. Create a new organization if prompted

## Step 2: Create a New Project

1. Click "New project"
2. Fill in the project details:
   - **Name**: fixingmaritime
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is fine to start

3. Click "Create new project" and wait for it to provision (takes 1-2 minutes)

## Step 3: Get Your Connection Details

Once your project is ready:

1. Go to Settings (gear icon) → Database
2. Copy your connection string from the "Connection string" section
3. Choose "URI" format and copy the string
4. Replace `[YOUR-PASSWORD]` with your actual database password

Your connection string will look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

## Step 4: Get Your API Keys

1. Go to Settings → API
2. Copy these values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 5: Run the Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Click "New query"
3. Copy the entire contents of `/supabase/schema.sql` file
4. Paste it in the SQL editor
5. Click "Run" to create all tables and functions

## Step 6: Create Local Environment File

1. Create a `.env.local` file in your project root:

```bash
cp .env.example .env.local
```

2. Update `.env.local` with your actual values:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Authentication
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-generated-secret-here"

# Generate NEXTAUTH_SECRET with:
# openssl rand -base64 32
```

## Step 7: Initialize Prisma

Run these commands to set up Prisma with your database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (this syncs your Prisma schema with Supabase)
npx prisma db push

# (Optional) Open Prisma Studio to view your data
npx prisma studio
```

## Step 8: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add these variables for Production:

   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `NEXTAUTH_URL` - https://fixingmaritime.com
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

4. Redeploy your site for changes to take effect

## Step 9: Test the Setup

1. Start your local development server:
```bash
npm run dev
```

2. Visit http://localhost:3001/signup
3. Try creating a new account
4. Check your Supabase dashboard → Table Editor → profiles to see the new user

## Troubleshooting

### "Database connection not configured" error
- Make sure `.env.local` file exists with correct values
- Restart your development server after adding environment variables

### "relation does not exist" error
- Run the SQL schema in Supabase SQL Editor
- Run `npx prisma db push` to sync schema

### Authentication not working
- Verify NEXTAUTH_SECRET is set correctly
- Check that DATABASE_URL is correct
- Make sure Supabase project is active (not paused)

## Next Steps

Once database is connected:
1. Test user registration and login
2. Configure Stripe for payment processing
3. Set up email notifications (optional)
4. Configure custom domain SSL certificate

## Security Notes

- Never commit `.env.local` to Git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Use Row Level Security (RLS) policies (already configured)
- Regularly backup your database from Supabase dashboard