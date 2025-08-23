#!/bin/bash

# Google Cloud SQL Setup Script for Maritime Services
echo "🚀 Setting up Google Cloud SQL for Maritime Services..."

# Configuration
PROJECT_ID="fixingmaritime"  # Your maritime services project
INSTANCE_NAME="maritime-db"
DATABASE_NAME="maritime"
DB_USER="maritime_user"
REGION="us-central1"
TIER="db-f1-micro"  # Cheapest tier (~$7/month)

echo "📋 Configuration:"
echo "   Project: $PROJECT_ID"
echo "   Instance: $INSTANCE_NAME"
echo "   Database: $DATABASE_NAME"
echo "   Region: $REGION"
echo "   Tier: $TIER"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set project
echo "🔧 Setting Google Cloud project..."
gcloud config set project $PROJECT_ID

# Enable Cloud SQL Admin API
echo "🔧 Enabling Cloud SQL Admin API..."
gcloud services enable sqladmin.googleapis.com

# Create SQL instance
echo "🏗️  Creating Cloud SQL instance..."
gcloud sql instances create $INSTANCE_NAME \
  --database-version=POSTGRES_14 \
  --tier=$TIER \
  --region=$REGION \
  --storage-type=SSD \
  --storage-size=10GB \
  --maintenance-release-channel=production \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=02 \
  --backup-start-time=03:00 \
  --backup

if [ $? -ne 0 ]; then
    echo "❌ Failed to create SQL instance"
    exit 1
fi

# Set root password
echo "🔐 Setting root password..."
POSTGRES_PASSWORD=$(openssl rand -base64 32)
gcloud sql users set-password postgres \
  --instance=$INSTANCE_NAME \
  --password="$POSTGRES_PASSWORD"

# Create application database
echo "🗄️  Creating application database..."
gcloud sql databases create $DATABASE_NAME --instance=$INSTANCE_NAME

# Create application user
echo "👤 Creating application user..."
APP_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create $DB_USER \
  --instance=$INSTANCE_NAME \
  --password="$APP_PASSWORD"

# Get connection info
echo "📡 Getting connection information..."
CONNECTION_NAME=$(gcloud sql instances describe $INSTANCE_NAME --format="value(connectionName)")
PUBLIC_IP=$(gcloud sql instances describe $INSTANCE_NAME --format="value(ipAddresses[0].ipAddress)")

# Generate connection string
CONNECTION_STRING="postgresql://${DB_USER}:${APP_PASSWORD}@${PUBLIC_IP}:5432/${DATABASE_NAME}?sslmode=require"

echo ""
echo "✅ Google Cloud SQL setup complete!"
echo ""
echo "📋 Connection Details:"
echo "   Instance: $INSTANCE_NAME"
echo "   Connection Name: $CONNECTION_NAME"
echo "   Public IP: $PUBLIC_IP"
echo "   Database: $DATABASE_NAME"
echo "   Username: $DB_USER"
echo "   Password: $APP_PASSWORD"
echo ""
echo "🔗 Database URL:"
echo "   $CONNECTION_STRING"
echo ""
echo "💡 Next steps:"
echo "   1. Update your .env.local with the new DATABASE_URL"
echo "   2. Run the schema migration script"
echo "   3. Import your existing data"
echo ""

# Save credentials to file
cat > gcloud-sql-credentials.txt << EOF
Google Cloud SQL Connection Details
===================================
Project ID: $PROJECT_ID
Instance Name: $INSTANCE_NAME
Connection Name: $CONNECTION_NAME
Public IP: $PUBLIC_IP
Database: $DATABASE_NAME
Username: $DB_USER
Password: $APP_PASSWORD

DATABASE_URL for .env.local:
DATABASE_URL="$CONNECTION_STRING"

Root Password (for admin access):
Root Password: $POSTGRES_PASSWORD
EOF

echo "💾 Credentials saved to: gcloud-sql-credentials.txt"
echo "⚠️  Keep this file secure and do not commit it to version control!"