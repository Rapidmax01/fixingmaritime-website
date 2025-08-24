-- Maritime Services E-commerce Database Schema
-- Compatible with Prisma Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom ENUM types
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Drop existing tables if they exist (in correct order to avoid FK constraints)
DROP TABLE IF EXISTS "order_tracking" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "media_files" CASCADE;
DROP TABLE IF EXISTS "seo_settings" CASCADE;
DROP TABLE IF EXISTS "content_sections" CASCADE;
DROP TABLE IF EXISTS "services" CASCADE;
DROP TABLE IF EXISTS "app_users" CASCADE;

-- Users table (mapped to app_users)
CREATE TABLE "app_users" (
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

-- Services table
CREATE TABLE "services" (
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

-- Orders table  
CREATE TABLE "orders" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL,
    "orderNumber" TEXT UNIQUE NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "trackingNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Order Items table
CREATE TABLE "order_items" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "orderId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "specifications" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Order Tracking table
CREATE TABLE "order_tracking" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "order_tracking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Content Sections table
CREATE TABLE "content_sections" (
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
CREATE TABLE "seo_settings" (
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
CREATE TABLE "media_files" (
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

-- Create indexes for better performance
CREATE INDEX "orders_userId_idx" ON "orders"("userId");
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX "order_tracking_orderId_idx" ON "order_tracking"("orderId");

-- Create function to automatically update updatedAt timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
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

-- Insert default super admin user (password: admin123 - hashed with bcrypt)
INSERT INTO "app_users" ("id", "email", "name", "password", "role", "emailVerified", "createdAt", "updatedAt") 
VALUES (
    uuid_generate_v4()::text,
    'admin@fixingmaritime.com',
    'Super Administrator',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewGw7o7rqbBEWpfK', -- bcrypt hash of 'admin123'
    'super_admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Insert some default services
INSERT INTO "services" ("id", "slug", "name", "description", "basePrice", "priceUnit", "active", "createdAt", "updatedAt")
VALUES 
    (uuid_generate_v4()::text, 'vessel-inspection', 'Vessel Inspection', 'Comprehensive vessel inspection services', 500.00, 'per inspection', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4()::text, 'cargo-survey', 'Cargo Survey', 'Professional cargo surveying and documentation', 300.00, 'per survey', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4()::text, 'marine-consultation', 'Marine Consultation', 'Expert marine consultation services', 150.00, 'per hour', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

-- Insert default content sections
INSERT INTO "content_sections" ("id", "type", "name", "title", "content", "active", "createdAt", "updatedAt")
VALUES
    (uuid_generate_v4()::text, 'hero', 'Homepage Hero', 'Professional Maritime Services', 'Your trusted partner for comprehensive maritime solutions', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4()::text, 'about', 'About Section', 'About Fixing Maritime', 'We provide professional maritime services with years of experience in the industry', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("type") DO NOTHING;

-- Verify the schema
SELECT 'Schema created successfully!' as status;

-- Show table information
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('app_users', 'services', 'orders', 'order_items', 'order_tracking', 'content_sections', 'seo_settings', 'media_files')
ORDER BY tablename;