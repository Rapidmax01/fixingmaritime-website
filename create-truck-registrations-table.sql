-- Create truck_registrations table
CREATE TABLE IF NOT EXISTS "truck_registrations" (
    "id" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "companyName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "taxId" TEXT,
    "yearsInBusiness" TEXT NOT NULL,
    "truckMake" TEXT NOT NULL,
    "truckModel" TEXT NOT NULL,
    "truckYear" INTEGER NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "vinNumber" TEXT,
    "truckType" TEXT NOT NULL,
    "capacity" TEXT,
    "insuranceProvider" TEXT NOT NULL,
    "insuranceExpiry" TIMESTAMP(3) NOT NULL,
    "licenseExpiry" TIMESTAMP(3) NOT NULL,
    "serviceAreas" TEXT[],
    "willingToRelocate" BOOLEAN NOT NULL DEFAULT false,
    "experience" TEXT NOT NULL,
    "specializations" TEXT[],
    "additionalNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "truck_registrations_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on plateNumber
ALTER TABLE "truck_registrations" ADD CONSTRAINT "truck_registrations_plateNumber_key" UNIQUE ("plateNumber");

-- Create indexes
CREATE INDEX IF NOT EXISTS "truck_registrations_email_idx" ON "truck_registrations"("email");
CREATE INDEX IF NOT EXISTS "truck_registrations_plateNumber_idx" ON "truck_registrations"("plateNumber");
CREATE INDEX IF NOT EXISTS "truck_registrations_status_idx" ON "truck_registrations"("status");

-- Add comments to the table
COMMENT ON TABLE "truck_registrations" IS 'Stores truck owner registration applications for partnership with Fixing Maritime';
COMMENT ON COLUMN "truck_registrations"."status" IS 'Registration status: pending, approved, rejected, suspended';
COMMENT ON COLUMN "truck_registrations"."businessType" IS 'Business type: individual or company';