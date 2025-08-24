#!/bin/bash

# Setup Cloud SQL Proxy for secure database connectivity
echo "🔐 Setting up Cloud SQL Proxy for secure database access..."

PROJECT_ID="fixingmaritime"
INSTANCE_NAME="maritime-db"
CONNECTION_NAME="$PROJECT_ID:us-central1:$INSTANCE_NAME"

echo "📋 Cloud SQL Proxy Setup Instructions:"
echo ""

echo "1. 📦 Enable Cloud SQL Admin API (if not already enabled):"
echo "   gcloud services enable sqladmin.googleapis.com --project=$PROJECT_ID"
echo ""

echo "2. 🔑 Create a service account for Cloud SQL Proxy:"
echo "   gcloud iam service-accounts create cloud-sql-proxy \\"
echo "     --display-name=\"Cloud SQL Proxy\" \\"
echo "     --project=$PROJECT_ID"
echo ""

echo "3. 🛡️  Grant permissions to the service account:"
echo "   gcloud projects add-iam-policy-binding $PROJECT_ID \\"
echo "     --member=\"serviceAccount:cloud-sql-proxy@$PROJECT_ID.iam.gserviceaccount.com\" \\"
echo "     --role=\"roles/cloudsql.client\""
echo ""

echo "4. 🗝️  Create and download service account key:"
echo "   gcloud iam service-accounts keys create cloud-sql-proxy-key.json \\"
echo "     --iam-account=cloud-sql-proxy@$PROJECT_ID.iam.gserviceaccount.com \\"
echo "     --project=$PROJECT_ID"
echo ""

echo "5. ⚙️  For Vercel deployment, add environment variables:"
echo "   GOOGLE_APPLICATION_CREDENTIALS_JSON=[contents of cloud-sql-proxy-key.json]"
echo "   DATABASE_URL=postgresql://maritime_user:PASSWORD@127.0.0.1:5432/maritime"
echo "   INSTANCE_CONNECTION_NAME=$CONNECTION_NAME"
echo ""

echo "6. 📝 Update your application to use Cloud SQL Proxy:"
echo "   - Install @google-cloud/sql-connector in your project"
echo "   - Use Cloud SQL connector in your database client"
echo ""

echo "🎯 Cloud SQL Proxy Benefits:"
echo "   ✅ No IP whitelisting needed"
echo "   ✅ Encrypted connections"
echo "   ✅ IAM authentication"
echo "   ✅ Better security overall"