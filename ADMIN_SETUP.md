# Admin Setup Guide

This guide will help you set up admin access for the Fixing Maritime platform.

## Prerequisites

1. Create a regular user account at https://www.fixingmaritime.com/signup
2. Verify your email address
3. Have access to your Supabase dashboard

## Method 1: Using Supabase Dashboard (Recommended)

1. **Login to Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Select your project

2. **Navigate to Table Editor**
   - Click "Table Editor" in the sidebar
   - Select the `app_users` table

3. **Update Your User**
   - Find your user by email
   - Click on the row
   - Change `role` from `customer` to `admin`
   - Click "Save"

4. **Access Admin Portal**
   - Go to https://www.fixingmaritime.com/admin/login
   - Login with your email and password

## Method 2: Using SQL Query

1. **Open SQL Editor in Supabase**
2. **Run this query** (replace with your email):
   ```sql
   UPDATE app_users 
   SET role = 'admin' 
   WHERE email = 'your-email@fixingmaritime.com';
   ```

## Method 3: Using the Script (Local Development)

If you're running locally:

```bash
# First, set your database URL
export DATABASE_URL="your-supabase-connection-string"

# Then run the script
node scripts/make-admin.js your-email@fixingmaritime.com
```

## Method 4: API Endpoint (First Admin Only)

For the very first admin, you can use the API endpoint:

```bash
curl -X POST https://www.fixingmaritime.com/api/admin/create-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@fixingmaritime.com",
    "secretKey": "fixingmaritime2024admin"
  }'
```

**Note**: This only works if no admin exists yet. Change the secret key in production!

## Admin Capabilities

Once you're an admin, you can:
- Manage all users
- View and manage orders
- Configure services
- Access analytics
- Update system settings

## Security Notes

- Admin sessions expire after 8 hours
- Admin portal is completely separate from customer login
- Always use strong passwords
- Consider changing the ADMIN_CREATION_SECRET in production

## Need Help?

Contact support if you need assistance with admin setup.