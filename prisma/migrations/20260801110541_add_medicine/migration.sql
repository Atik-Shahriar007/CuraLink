-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "genericName" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "therapeuticCategory" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "prescriptionRequired" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "sideEffects" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);
