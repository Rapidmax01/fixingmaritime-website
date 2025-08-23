-- Add enhanced profile fields to app_users table
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "primaryPhone" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "cellPhone" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "homePhone" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "workPhone" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "homeAddress" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "officeAddress" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE "app_users" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;

-- Verify columns were added
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'app_users' 
ORDER BY column_name;