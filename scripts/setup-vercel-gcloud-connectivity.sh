#!/bin/bash

# Setup Google Cloud SQL connectivity for Vercel
echo "🔧 Configuring Google Cloud SQL for Vercel connectivity..."

PROJECT_ID="fixingmaritime"
INSTANCE_NAME="maritime-db"

# Vercel's commonly used IP ranges (these change periodically)
# Note: Vercel uses dynamic IPs, so we need to be more permissive
VERCEL_IP_RANGES=(
  "174.203.37.21"          # Your current IP (keep for local access)
  "76.76.19.0/24"          # Vercel range 1
  "64.252.64.0/18"         # Vercel range 2
  "198.143.164.0/22"       # Vercel range 3
  "207.246.64.0/18"        # Vercel range 4
  "216.198.0.0/16"         # Vercel range 5
)

echo "📡 Adding Vercel IP ranges to authorized networks..."

# Build the authorized networks string
NETWORKS=$(IFS=,; echo "${VERCEL_IP_RANGES[*]}")

# Update Cloud SQL instance
gcloud sql instances patch $INSTANCE_NAME \
  --project=$PROJECT_ID \
  --authorized-networks="$NETWORKS" \
  --quiet

if [ $? -eq 0 ]; then
  echo "✅ Successfully configured authorized networks"
  echo "📋 Authorized IP ranges:"
  printf '%s\n' "${VERCEL_IP_RANGES[@]}"
else
  echo "❌ Failed to update authorized networks"
  exit 1
fi

echo ""
echo "🎉 Vercel connectivity configured!"
echo "   Your admin portal should now work at:"
echo "   https://www.fixingmaritime.com/admin/login"
echo ""
echo "🔒 For enhanced security, consider using Cloud SQL Proxy instead"