#!/bin/bash

echo "🏗️  Setting up Google Cloud SQL Schema..."

# Get connection details
if [ ! -f "gcloud-sql-credentials.txt" ]; then
    echo "❌ gcloud-sql-credentials.txt not found!"
    exit 1
fi

# Extract connection details
DB_USER="maritime_user"
DB_NAME="maritime"
INSTANCE_NAME="maritime-db"

echo "📋 Using:"
echo "   Instance: $INSTANCE_NAME"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Create schema file from our fixed SQL
echo "📄 Preparing schema..."
cp SUPABASE_FIXED_FINAL.sql gcloud-schema.sql

# Remove Supabase-specific parts and fix for GCloud
sed -i 's/CURRENT_TIMESTAMP/NOW()/g' gcloud-schema.sql
sed -i '/INSERT INTO/,$d' gcloud-schema.sql  # Remove insert statements for now

echo "🔄 Applying schema to Google Cloud SQL..."
echo "   This will prompt for your password"
echo ""

# Apply schema using gcloud sql
gcloud sql connect $INSTANCE_NAME --user=$DB_USER --database=$DB_NAME < gcloud-schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema created successfully!"
else
    echo "❌ Schema creation failed"
    echo "   Try running manually with:"
    echo "   gcloud sql connect $INSTANCE_NAME --user=$DB_USER --database=$DB_NAME"
    exit 1
fi

echo ""
echo "🎉 Database schema is ready!"
echo "   Now run the import script again:"
echo "   node scripts/import-to-gcloud-sql.js \"your-connection-string\""