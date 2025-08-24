-- =====================================================
-- SUPABASE DATABASE SCHEMA FIX - FINAL VERSION
-- =====================================================
-- Copy and paste this script into Supabase SQL Editor
-- This fixes the UUID generation and null constraint issues

-- Enable UUID extension (critical for ID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Test UUID generation
SELECT uuid_generate_v4() as test_uuid;

-- Create custom ENUM types
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
-- FIX: Handle existing tables with wrong column names
-- =====================================================

-- Check and rename columns in orders table if needed
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "orders" RENAME COLUMN "user_id" TO "userId";
        RAISE NOTICE 'Fixed: Renamed user_id to userId in orders table';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Orders table column rename: %', SQLERRM;
END $$;

-- =====================================================
-- CREATE TABLES WITH PROPER UUID DEFAULTS
-- =====================================================

-- Users table (app_users) with enhanced profile fields
CREATE TABLE IF NOT EXISTS "app_users" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "company" TEXT,
    -- Legacy fields for backward compatibility
    "phone" TEXT,
    "address" TEXT,
    -- Enhanced profile fields
    "primaryPhone" TEXT,
    "cellPhone" TEXT,
    "homePhone" TEXT,
    "workPhone" TEXT,
    "homeAddress" TEXT,
    "officeAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    -- Account verification
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifyToken" TEXT,
    "emailVerifyExpires" TIMESTAMP(3),
    "role" TEXT NOT NULL DEFAULT 'customer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add enhanced profile columns if they don't exist
DO $$ 
BEGIN
    -- Add enhanced phone columns
    ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "primaryPhone" TEXT;
    ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "cellPhone" TEXT;
    ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "homePhone" TEXT;
    ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "workPhone" TEXT;
    
    -- Add enhanced address columns
    ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "homeAddress" TEXT;
    ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "officeAddress" TEXT;
    ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "state" TEXT;
    ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
    
    RAISE NOTICE 'Enhanced profile columns added to app_users table';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'App users column addition: %', SQLERRM;
END $$;

-- Services table
CREATE TABLE IF NOT EXISTS "services" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text PRIMARY KEY,
    "slug" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2),
    "priceUnit" TEXT,
    "features" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Orders table with CORRECT column names
CREATE TABLE IF NOT EXISTS "orders" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "orderNumber" TEXT UNIQUE NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "trackingNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "specifications" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Order Tracking table
CREATE TABLE IF NOT EXISTS "order_tracking" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Content Sections table
CREATE TABLE IF NOT EXISTS "content_sections" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("type")
);

-- SEO Settings table
CREATE TABLE IF NOT EXISTS "seo_settings" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "ogTitle" TEXT NOT NULL,
    "ogDescription" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Media Files table
CREATE TABLE IF NOT EXISTS "media_files" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4()::text PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Create indexes (ignore errors if they already exist)
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "orders_orderNumber_idx" ON "orders"("orderNumber");
CREATE INDEX IF NOT EXISTS "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX IF NOT EXISTS "order_tracking_orderId_idx" ON "order_tracking"("orderId");

-- =====================================================
-- CREATE AUTOMATIC TIMESTAMP TRIGGERS
-- =====================================================

-- Create function to automatically update updatedAt timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
DROP TRIGGER IF EXISTS update_app_users_updated_at ON "app_users";
DROP TRIGGER IF EXISTS update_services_updated_at ON "services";
DROP TRIGGER IF EXISTS update_orders_updated_at ON "orders";
DROP TRIGGER IF EXISTS update_content_sections_updated_at ON "content_sections";
DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON "seo_settings";
DROP TRIGGER IF EXISTS update_media_files_updated_at ON "media_files";

CREATE TRIGGER update_app_users_updated_at BEFORE UPDATE ON "app_users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON "services"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "orders"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON "content_sections"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON "seo_settings"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON "media_files"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSERT DEFAULT DATA WITH EXPLICIT UUID GENERATION
-- =====================================================

-- Insert default super admin user with explicit UUID
INSERT INTO "app_users" ("id", "email", "name", "password", "role", "emailVerified", "createdAt", "updatedAt") 
VALUES (
    uuid_generate_v4()::text,
    'admin@fixingmaritime.com',
    'Super Administrator',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewGw7o7rqbBEWpfK', -- password: admin123
    'super_admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO UPDATE SET
    "name" = EXCLUDED."name",
    "role" = EXCLUDED."role",
    "emailVerified" = EXCLUDED."emailVerified";

-- Insert default services with explicit UUIDs
INSERT INTO "services" ("id", "slug", "name", "description", "basePrice", "priceUnit", "active", "createdAt", "updatedAt")
VALUES 
    (uuid_generate_v4()::text, 'vessel-inspection', 'Vessel Inspection', 'Comprehensive vessel inspection services', 500.00, 'per inspection', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4()::text, 'cargo-survey', 'Cargo Survey', 'Professional cargo surveying and documentation', 300.00, 'per survey', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4()::text, 'marine-consultation', 'Marine Consultation', 'Expert marine consultation services', 150.00, 'per hour', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "basePrice" = EXCLUDED."basePrice";

-- Insert default content sections with explicit UUIDs
INSERT INTO "content_sections" ("id", "type", "name", "title", "content", "active", "createdAt", "updatedAt")
VALUES
    (uuid_generate_v4()::text, 'hero', 'Homepage Hero', 'Professional Maritime Services', 'Your trusted partner for comprehensive maritime solutions', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4()::text, 'about', 'About Section', 'About Fixing Maritime', 'We provide professional maritime services with years of experience in the industry', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("type") DO UPDATE SET
    "title" = EXCLUDED."title",
    "content" = EXCLUDED."content";

-- =====================================================
-- ADD FOREIGN KEY CONSTRAINTS SAFELY
-- =====================================================

-- Add foreign key constraints (ignore if they already exist)
DO $$
BEGIN
    BEGIN
        ALTER TABLE "orders" 
        ADD CONSTRAINT "orders_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "app_users"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN
        -- Constraint already exists, ignore
        NULL;
    END;
    
    BEGIN
        ALTER TABLE "order_items" 
        ADD CONSTRAINT "order_items_orderId_fkey" 
        FOREIGN KEY ("orderId") REFERENCES "orders"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE "order_items" 
        ADD CONSTRAINT "order_items_serviceId_fkey" 
        FOREIGN KEY ("serviceId") REFERENCES "services"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER TABLE "order_tracking" 
        ADD CONSTRAINT "order_tracking_orderId_fkey" 
        FOREIGN KEY ("orderId") REFERENCES "orders"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;

-- =====================================================
-- VERIFY AND REPORT STATUS
-- =====================================================

-- Test UUID generation
SELECT 'UUID Test:' as test, uuid_generate_v4()::text as sample_uuid;

-- Show table information
SELECT '✅ SCHEMA FIX COMPLETE!' as status;

-- Show created tables
SELECT 
    'Tables:' as info,
    string_agg(tablename, ', ' ORDER BY tablename) as table_list
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('app_users', 'services', 'orders', 'order_items', 'order_tracking', 'content_sections', 'seo_settings', 'media_files');

-- Verify orders table columns
SELECT 
    'Orders columns:' as info,
    string_agg(column_name, ', ' ORDER BY column_name) as columns
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'orders';

-- Show admin users
SELECT 
    'Admin users:' as info,
    count(*) as count,
    string_agg(email || ' (' || role || ')', ', ') as users
FROM "app_users" 
WHERE role IN ('super_admin', 'admin');

-- Show services
SELECT 'Services:' as info, count(*) as count FROM "services";

SELECT '🎉 Database is ready! UUID generation working!' as final_status;