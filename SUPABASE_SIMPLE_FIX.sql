-- =====================================================
-- SIMPLE SUPABASE DATABASE FIX
-- =====================================================
-- Copy and paste this script into Supabase SQL Editor
-- This fixes the "column user_id does not exist" error

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
DO $$ 
BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'in_transit', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- STEP 1: Fix existing orders table column naming
-- =====================================================

-- Check and rename user_id to userId if needed
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE "orders" RENAME COLUMN "user_id" TO "userId";
    END IF;
END $$;

-- =====================================================  
-- STEP 2: Create missing tables
-- =====================================================

-- Users table with enhanced profile fields
CREATE TABLE IF NOT EXISTS "app_users" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "emailVerified" BOOLEAN DEFAULT false,
    "emailVerifyToken" TEXT,
    "emailVerifyExpires" TIMESTAMP(3),
    "role" TEXT DEFAULT 'customer',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS "services" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "slug" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2),
    "priceUnit" TEXT,
    "features" JSONB,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Orders table with correct column name
CREATE TABLE IF NOT EXISTS "orders" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL,
    "orderNumber" TEXT UNIQUE NOT NULL,
    "status" "OrderStatus" DEFAULT 'pending',
    "paymentStatus" "PaymentStatus" DEFAULT 'pending',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "trackingNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table  
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "orderId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "quantity" INTEGER DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "specifications" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Order Tracking table
CREATE TABLE IF NOT EXISTS "order_tracking" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Content Sections table
CREATE TABLE IF NOT EXISTS "content_sections" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "type" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- SEO Settings table
CREATE TABLE IF NOT EXISTS "seo_settings" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "ogTitle" TEXT NOT NULL,
    "ogDescription" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Media Files table
CREATE TABLE IF NOT EXISTS "media_files" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "uploadedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STEP 3: Add enhanced profile fields to app_users
-- =====================================================

-- Add enhanced phone fields
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "primaryPhone" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "cellPhone" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "homePhone" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "workPhone" TEXT;

-- Add enhanced address fields  
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "homeAddress" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "officeAddress" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;

-- =====================================================
-- STEP 4: Insert default data
-- =====================================================

-- Insert default admin user
INSERT INTO "app_users" ("email", "name", "password", "role", "emailVerified") 
VALUES (
    'admin@fixingmaritime.com',
    'Super Administrator', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewGw7o7rqbBEWpfK',
    'super_admin',
    true
) ON CONFLICT ("email") DO NOTHING;

-- Insert default services
INSERT INTO "services" ("slug", "name", "description", "basePrice", "priceUnit") VALUES 
('vessel-inspection', 'Vessel Inspection', 'Comprehensive vessel inspection services', 500.00, 'per inspection'),
('cargo-survey', 'Cargo Survey', 'Professional cargo surveying and documentation', 300.00, 'per survey'),
('marine-consultation', 'Marine Consultation', 'Expert marine consultation services', 150.00, 'per hour')
ON CONFLICT ("slug") DO NOTHING;

-- Insert default content
INSERT INTO "content_sections" ("type", "name", "title", "content") VALUES
('hero', 'Homepage Hero', 'Professional Maritime Services', 'Your trusted partner for comprehensive maritime solutions'),
('about', 'About Section', 'About Fixing Maritime', 'We provide professional maritime services with years of experience')
ON CONFLICT ("type") DO NOTHING;

-- =====================================================
-- STEP 5: Verify the fix
-- =====================================================

-- Show success message
SELECT '✅ Database schema fixed successfully!' as status;

-- Show tables created
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Verify orders table has correct columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public' 
ORDER BY column_name;