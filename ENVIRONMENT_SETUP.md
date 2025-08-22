# Environment Variables Setup

## Important: After removing .env.local from git

Since `.env.local` is no longer tracked by git, you need to set up environment variables in Vercel Dashboard for production to work.

## Required Environment Variables for Vercel

Go to your Vercel Dashboard → Project Settings → Environment Variables and add:

```
DATABASE_URL=postgresql://postgres.myrmiimwgdwjldqvyfou:SHD66auLsg!P%26Pv@aws-1-us-east-2.pooler.supabase.com:5432/postgres?pgbouncer=true
NEXTAUTH_SECRET=Q7NMJQ4CNu3GS15TVI0Khbw95cWMSLAH8aPwN8uTUAw=
NEXTAUTH_URL=https://fixingmaritime.com
GMAIL_USER=info@fixingmaritime.com
GMAIL_APP_PASSWORD=xhxs ufrs ptou sqhh
NEXT_PUBLIC_SUPABASE_URL=https://myrmiimwgdwjldqvyfou.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cm1paW13Z2R3amxkcXZ5Zm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDM1NjIsImV4cCI6MjA3MTI3OTU2Mn0.GqpPgoUQluJzCxOL_uZBmltaFw4wM-4UlaolYSJnN3w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cm1paW13Z2R3amxkcXZ5Zm91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwMzU2MiwiZXhwIjoyMDcxMjc5NTYyfQ.8HKsGGNbb08YstVHrBLPbkNQnKLGuto0jO2PjSHe2Oo
```

## Optional Environment Variables

```
GOOGLE_CLIENT_ID=240082718220-iurrcef3s1re37tht4o9gjg95ovo5ckj.apps.googleusercontent.com
ADMIN_CREATION_SECRET=fixingmaritime2024admin
```

## Local Development

For local development, keep your `.env.local` file with the same variables. This file is now gitignored and won't be committed.

## Important Notes

1. Make sure to set these variables for all environments (Production, Preview, Development) in Vercel
2. The `NEXT_PUBLIC_*` variables are exposed to the browser, so they're safe to share
3. Keep `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXTAUTH_SECRET` secret
4. After setting up, redeploy your application for changes to take effect