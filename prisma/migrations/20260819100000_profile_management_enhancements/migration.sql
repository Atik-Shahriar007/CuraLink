-- AlterTable: Account - deactivation + notification preferences
ALTER TABLE "Account" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Account" ADD COLUMN     "deactivatedAt" TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Account" ADD COLUMN     "smsNotifications" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable: Patient - profile photo
ALTER TABLE "Patient" ADD COLUMN     "photoUrl" TEXT;

-- AlterTable: AmbulanceProvider - profile photo + license/operating hours
ALTER TABLE "AmbulanceProvider" ADD COLUMN     "photoUrl" TEXT;
ALTER TABLE "AmbulanceProvider" ADD COLUMN     "licenseNumber" TEXT;
ALTER TABLE "AmbulanceProvider" ADD COLUMN     "operatingHours" TEXT;
