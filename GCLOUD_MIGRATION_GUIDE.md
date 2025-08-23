# 🚀 Google Cloud SQL Migration Guide

Complete step-by-step guide to migrate from Supabase to Google Cloud SQL.

## 📋 Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud CLI** installed ([Download here](https://cloud.google.com/sdk/docs/install))
3. **Project with Cloud SQL API enabled**

## 🎯 Step-by-Step Migration

### Step 1: Set Up Google Cloud SQL

1. **Make the setup script executable:**
```bash
chmod +x scripts/setup-gcloud-sql.sh
```

2. **Edit the script with your project ID:**
```bash
# Open scripts/setup-gcloud-sql.sh
# Replace 'your-project-id' with your actual Google Cloud project ID
```

3. **Run the setup:**
```bash
./scripts/setup-gcloud-sql.sh
```

This will:
- ✅ Create a PostgreSQL instance (~$7/month)
- ✅ Set up database and user
- ✅ Generate secure passwords
- ✅ Save connection details to `gcloud-sql-credentials.txt`

### Step 2: Export Supabase Data

**⚠️ Important: Wake your Supabase database first!**

1. **Wake Supabase database:**
   - Go to https://supabase.com/dashboard
   - Open SQL Editor
   - Run: `SELECT 1;`

2. **Export your data:**
```bash
chmod +x scripts/export-supabase-data.js
node scripts/export-supabase-data.js
```

This creates `supabase-export.json` with all your data.

### Step 3: Import to Google Cloud SQL

1. **Get your connection string from the credentials file:**
```bash
cat gcloud-sql-credentials.txt
```

2. **Import your data:**
```bash
chmod +x scripts/import-to-gcloud-sql.js
node scripts/import-to-gcloud-sql.js "YOUR_GCLOUD_CONNECTION_STRING"
```

### Step 4: Update Application Configuration

1. **Update .env.local:**
```bash
# Replace the DATABASE_URL with your Google Cloud SQL connection string
DATABASE_URL="postgresql://maritime_user:PASSWORD@IP:5432/maritime?sslmode=require"
```

2. **Test the connection:**
```bash
npm run dev
# Visit http://localhost:3001/admin/profile/debug
```

## 💰 Cost Comparison

| Service | Monthly Cost | Features |
|---------|--------------|----------|
| **Supabase Free** | $0 | Auto-pause (unreliable) |
| **Supabase Pro** | $25 | 24/7 availability |
| **Google Cloud SQL** | **$7-10** | 24/7 availability, better performance |

## 🎯 Benefits of Google Cloud SQL

- ✅ **70% cheaper** than Supabase Pro
- ✅ **Always available** (no auto-pause)
- ✅ **Better performance** (dedicated resources)
- ✅ **Easy scaling** as you grow
- ✅ **Full PostgreSQL features**

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test connection directly
psql "postgresql://user:pass@ip:5432/db"
```

### Migration Errors
```bash
# Re-run import with verbose logging
node scripts/import-to-gcloud-sql.js "connection_string" --verbose
```

### Schema Issues
```bash
# Manually run schema setup
psql -f SUPABASE_FIXED_FINAL.sql "connection_string"
```

## 🎉 Post-Migration Checklist

- [ ] Profile page loads correctly
- [ ] Admin login works
- [ ] User management functions
- [ ] All data migrated successfully
- [ ] Update Vercel environment variables
- [ ] Remove Supabase project (optional)

## 🔐 Security Notes

1. **Keep credentials secure:**
   - Add `gcloud-sql-credentials.txt` to `.gitignore`
   - Use environment variables for connection strings
   - Rotate passwords periodically

2. **Network security:**
   - Consider using Cloud SQL Proxy for production
   - Restrict IP access if needed
   - Enable SSL/TLS connections

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Google Cloud SQL documentation
3. Verify network connectivity and firewall settings

---

**Total Migration Time: ~15-30 minutes**  
**Cost Savings: ~$15-18/month** 🎯