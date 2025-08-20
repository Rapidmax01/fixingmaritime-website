# Supabase Pooler Connection Setup

## Why Use Connection Pooling?

Connection pooling helps when:
- Direct database connections are blocked by firewalls
- You need better connection management for serverless environments
- You're deploying to Vercel (which benefits from pooled connections)

## Steps to Get Your Pooler Connection String:

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `myrmiimwgdwjldqvyfou`

2. **Navigate to Database Settings**
   - Click on "Settings" in the sidebar
   - Click on "Database" tab

3. **Find Connection Pooling Section**
   - Scroll down to "Connection pooling"
   - Toggle it ON if not already enabled

4. **Configure Pooling Mode**
   - Select "Session" mode (best for web apps)
   - Transaction mode is for serverless functions

5. **Copy the Pooler Connection String**
   - It will look like:
   ```
   postgres://postgres.myrmiimwgdwjldqvyfou:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

6. **Important Notes**:
   - The password might need URL encoding if it contains special characters
   - Port is 6543 (not 5432)
   - Host ends with `.pooler.supabase.com`

## Example Pooler URL Structure:

```
postgres://postgres.myrmiimwgdwjldqvyfou:SHD66auLsg!P%26Pv@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Testing the Pooler Connection:

After updating your `.env.local` with the pooler URL:

```bash
# Test with Prisma
npx dotenv -e .env.local -- prisma db push

# Or just generate client if tables exist
npx prisma generate
```

## For Vercel Deployment:

Use the pooler connection string for the `DATABASE_URL` environment variable in Vercel. This ensures reliable connections in the serverless environment.