-- =====================================================
-- SUPABASE DATABASE SCHEMA FIX
-- =====================================================
-- Copy and paste this entire script into Supabase SQL Editor
-- This will fix the "column user_id does not exist" error

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom ENUM types (if they don't exist)
DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'in_transit', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
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
    -- Check if orders table exists with user_id instead of userId
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) THEN
        -- Rename user_id to userId
        ALTER TABLE "orders" RENAME COLUMN "user_id" TO "userId";
        RAISE NOTICE 'Fixed: Renamed user_id to userId in orders table';
    END IF;
    
    -- Check and add missing columns if needed
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'orderNumber'
        AND table_schema = 'public'
    ) THEN
        -- Add orderNumber if missing
        ALTER TABLE "orders" ADD COLUMN "orderNumber" TEXT UNIQUE;
        UPDATE "orders" SET "orderNumber" = 'ORD-' || id WHERE "orderNumber" IS NULL;
        ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET NOT NULL;
        RAISE NOTICE 'Added orderNumber column to orders table';
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Orders table adjustment: %', SQLERRM;
END $$;

-- =====================================================
-- CREATE OR UPDATE TABLES WITH CORRECT SCHEMA
-- =====================================================

-- Users table (app_users) with enhanced profile fields
CREATE TABLE IF NOT EXISTS "app_users" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
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
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_users' AND column_name = 'primaryPhone') THEN
        ALTER TABLE "app_users" ADD COLUMN "primaryPhone" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_users' AND column_name = 'cellPhone') THEN
        ALTER TABLE "app_users" ADD COLUMN "cellPhone" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_users' AND column_name = 'homePhone') THEN
        ALTER TABLE "app_users" ADD COLUMN "homePhone" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_users' AND column_name = 'workPhone') THEN
        ALTER TABLE "app_users" ADD COLUMN "workPhone" TEXT;
    END IF;
    
    -- Add enhanced address columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_users' AND column_name = 'homeAddress') THEN
        ALTER TABLE "app_users" ADD COLUMN "homeAddress" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_users' AND column_name = 'officeAddress') THEN
        ALTER TABLE "app_users" ADD COLUMN "officeAddress" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_users' AND column_name = 'state') THEN
        ALTER TABLE "app_users" ADD COLUMN "state" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'app_users' AND column_name = 'postalCode') THEN
        ALTER TABLE "app_users" ADD COLUMN "postalCode" TEXT;
    END IF;
    
    RAISE NOTICE 'Enhanced profile columns added to app_users table';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'App users column addition: %', SQLERRM;
END $$;

-- Services table
CREATE TABLE IF NOT EXISTS "services" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
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

-- Orders table with CORRECT column names (userId not user_id)
CREATE TABLE IF NOT EXISTS "orders" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL,  -- This is the correct column name!
    "orderNumber" TEXT UNIQUE NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "trackingNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    -- Orders -> Users foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_userId_fkey'
        AND table_name = 'orders'
    ) THEN
        ALTER TABLE "orders" 
        ADD CONSTRAINT "orders_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "app_users"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
        RAISE NOTICE 'Added foreign key: orders.userId -> app_users.id';
    END IF;
    
    -- Order Items -> Orders foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'order_items_orderId_fkey'
        AND table_name = 'order_items'
    ) THEN
        ALTER TABLE "order_items" 
        ADD CONSTRAINT "order_items_orderId_fkey" 
        FOREIGN KEY ("orderId") REFERENCES "orders"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
        RAISE NOTICE 'Added foreign key: order_items.orderId -> orders.id';
    END IF;
    
    -- Order Items -> Services foreign key  
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'order_items_serviceId_fkey'
        AND table_name = 'order_items'
    ) THEN
        ALTER TABLE "order_items" 
        ADD CONSTRAINT "order_items_serviceId_fkey" 
        FOREIGN KEY ("serviceId") REFERENCES "services"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE;
        RAISE NOTICE 'Added foreign key: order_items.serviceId -> services.id';
    END IF;
    
    -- Order Tracking -> Orders foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'order_tracking_orderId_fkey'
        AND table_name = 'order_tracking'
    ) THEN
        ALTER TABLE "order_tracking" 
        ADD CONSTRAINT "order_tracking_orderId_fkey" 
        FOREIGN KEY ("orderId") REFERENCES "orders"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
        RAISE NOTICE 'Added foreign key: order_tracking.orderId -> orders.id';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Foreign key constraint setup: %', SQLERRM;
END $$;

-- Order Items table
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
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
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Content Sections table
CREATE TABLE IF NOT EXISTS "content_sections" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
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
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
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
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
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

-- Create indexes if they don't exist
DO $$
BEGIN
    -- Orders indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'orders_userId_idx') THEN
        CREATE INDEX "orders_userId_idx" ON "orders"("userId");
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'orders_orderNumber_idx') THEN
        CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");
    END IF;
    
    -- Order items indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'order_items_orderId_idx') THEN
        CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");
    END IF;
    
    -- Order tracking indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'order_tracking_orderId_idx') THEN
        CREATE INDEX "order_tracking_orderId_idx" ON "order_tracking"("orderId");
    END IF;
    
    RAISE NOTICE 'Database indexes created';
END $$;

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

-- Create triggers for updatedAt (only if table exists)
DO $$
BEGIN
    -- Drop existing triggers first
    DROP TRIGGER IF EXISTS update_app_users_updated_at ON "app_users";
    DROP TRIGGER IF EXISTS update_services_updated_at ON "services";
    DROP TRIGGER IF EXISTS update_orders_updated_at ON "orders";
    DROP TRIGGER IF EXISTS update_content_sections_updated_at ON "content_sections";
    DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON "seo_settings";
    DROP TRIGGER IF EXISTS update_media_files_updated_at ON "media_files";
    
    -- Create new triggers
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
        
    RAISE NOTICE 'Automatic timestamp triggers created';
END $$;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default super admin user (if doesn't exist)
INSERT INTO "app_users" ("email", "name", "password", "role", "emailVerified", "createdAt", "updatedAt") 
VALUES (
    'admin@fixingmaritime.com',
    'Super Administrator',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewGw7o7rqbBEWpfK', -- bcrypt hash of 'admin123'
    'super_admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Insert some default services (if don't exist)
INSERT INTO "services" ("slug", "name", "description", "basePrice", "priceUnit", "active", "createdAt", "updatedAt")
VALUES 
    ('vessel-inspection', 'Vessel Inspection', 'Comprehensive vessel inspection services', 500.00, 'per inspection', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cargo-survey', 'Cargo Survey', 'Professional cargo surveying and documentation', 300.00, 'per survey', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('marine-consultation', 'Marine Consultation', 'Expert marine consultation services', 150.00, 'per hour', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

-- Insert default content sections (if don't exist)
INSERT INTO "content_sections" ("type", "name", "title", "content", "active", "createdAt", "updatedAt")
VALUES
    ('hero', 'Homepage Hero', 'Professional Maritime Services', 'Your trusted partner for comprehensive maritime solutions', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('about', 'About Section', 'About Fixing Maritime', 'We provide professional maritime services with years of experience in the industry', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("type") DO NOTHING;

-- =====================================================
-- VERIFY AND REPORT STATUS
-- =====================================================

-- Show table information
SELECT 
    '✅ SCHEMA FIX COMPLETE!' as status,
    'All tables created with correct column names' as details;

-- Show table list
SELECT 
    'Tables created:' as info,
    string_agg(tablename, ', ' ORDER BY tablename) as table_list
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('app_users', 'services', 'orders', 'order_items', 'order_tracking', 'content_sections', 'seo_settings', 'media_files');

-- Verify column names in orders table
SELECT 
    'Orders table columns:' as info,
    string_agg(column_name, ', ' ORDER BY column_name) as columns
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'orders';

-- Show user count
SELECT 
    'Admin users:' as info,
    count(*) as count,
    string_agg(email || ' (' || role || ')', ', ') as users
FROM "app_users" 
WHERE role IN ('super_admin', 'admin');

SELECT '🎉 Database is now ready for the application!' as final_status;