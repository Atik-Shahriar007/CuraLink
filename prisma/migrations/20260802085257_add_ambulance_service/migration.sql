-- CreateEnum
CREATE TYPE "AmbulanceRequestStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'DISPATCHED', 'ARRIVED', 'COMPLETED', 'CANCELED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'AMBULANCE_PROVIDER';

-- CreateTable
CREATE TABLE "AmbulanceProvider" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "organizationName" TEXT,
    "vehicleInfo" TEXT,
    "serviceArea" TEXT,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbulanceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmbulanceRequest" (
    "id" TEXT NOT NULL,
    "status" "AmbulanceRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "patientId" TEXT NOT NULL,
    "providerId" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT NOT NULL,
    "situationDescription" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AmbulanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AmbulanceProvider_accountId_key" ON "AmbulanceProvider"("accountId");

-- AddForeignKey
ALTER TABLE "AmbulanceProvider" ADD CONSTRAINT "AmbulanceProvider_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbulanceRequest" ADD CONSTRAINT "AmbulanceRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbulanceRequest" ADD CONSTRAINT "AmbulanceRequest_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "AmbulanceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
