-- AlterTable
ALTER TABLE "Medicine" ALTER COLUMN "manufacturer" DROP NOT NULL;
ALTER TABLE "Medicine" ALTER COLUMN "description" DROP NOT NULL;
ALTER TABLE "Medicine" ALTER COLUMN "dosage" DROP NOT NULL;
ALTER TABLE "Medicine" ALTER COLUMN "sideEffects" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Medicine_brandName_idx" ON "Medicine"("brandName");

-- CreateIndex
CREATE INDEX "Medicine_therapeuticCategory_idx" ON "Medicine"("therapeuticCategory");
