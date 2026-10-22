-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('BUG_GLITCH', 'WRONG_INFORMATION', 'PAYMENT_PROBLEM', 'CONSULTATION_PROBLEM', 'AMBULANCE_PROBLEM', 'MEDICINE_CATALOG_PROBLEM', 'MEDICAL_RECORD_PROBLEM', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "IssueSource" AS ENUM ('PATIENT', 'DOCTOR', 'PROVIDER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'FIXED', 'VERIFIED', 'CLOSED');

-- CreateTable
CREATE TABLE "IssueReport" (
    "id" TEXT NOT NULL,
    "reference" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ReportCategory" NOT NULL,
    "severity" "ReportSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "ReportStatus" NOT NULL DEFAULT 'NEW',
    "source" "IssueSource" NOT NULL DEFAULT 'PATIENT',
    "contextPath" TEXT,
    "contextEntity" TEXT,
    "contextEntityId" TEXT,
    "browserInfo" TEXT,
    "attachmentUrl" TEXT,
    "reporterId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "resolutionNote" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueReportEvent" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "fromValue" TEXT,
    "toValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IssueReportEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRule" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "severity" "ReportSeverity" NOT NULL,
    "threshold" INTEGER NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "lastValue" INTEGER,
    "lastStatus" TEXT,
    "lastRunMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceCheck" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "sampleIds" TEXT[],
    "durationMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceIncident" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "severity" "ReportSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "openedValue" INTEGER NOT NULL,
    "peakValue" INTEGER NOT NULL DEFAULT 0,
    "assigneeId" TEXT,
    "rootCause" TEXT,
    "actionTaken" TEXT,
    "autoFixApplied" BOOLEAN NOT NULL DEFAULT false,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "fixedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "verificationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceIncident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IssueReport_reference_key" ON "IssueReport"("reference");

-- CreateIndex
CREATE INDEX "IssueReport_status_idx" ON "IssueReport"("status");

-- CreateIndex
CREATE INDEX "IssueReport_severity_idx" ON "IssueReport"("severity");

-- CreateIndex
CREATE INDEX "IssueReport_createdAt_idx" ON "IssueReport"("createdAt");

-- CreateIndex
CREATE INDEX "IssueReport_contextEntity_contextEntityId_idx" ON "IssueReport"("contextEntity", "contextEntityId");

-- CreateIndex
CREATE INDEX "IssueReportEvent_reportId_idx" ON "IssueReportEvent"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceRule_key_key" ON "MaintenanceRule"("key");

-- CreateIndex
CREATE INDEX "MaintenanceRule_area_idx" ON "MaintenanceRule"("area");

-- CreateIndex
CREATE INDEX "MaintenanceCheck_ruleId_createdAt_idx" ON "MaintenanceCheck"("ruleId", "createdAt");

-- CreateIndex
CREATE INDEX "MaintenanceIncident_status_idx" ON "MaintenanceIncident"("status");

-- CreateIndex
CREATE INDEX "MaintenanceIncident_ruleId_openedAt_idx" ON "MaintenanceIncident"("ruleId", "openedAt");

-- CreateIndex
CREATE INDEX "MaintenanceIncident_openedAt_idx" ON "MaintenanceIncident"("openedAt");

-- AddForeignKey
ALTER TABLE "IssueReport" ADD CONSTRAINT "IssueReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueReport" ADD CONSTRAINT "IssueReport_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueReportEvent" ADD CONSTRAINT "IssueReportEvent_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "IssueReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueReportEvent" ADD CONSTRAINT "IssueReportEvent_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceCheck" ADD CONSTRAINT "MaintenanceCheck_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "MaintenanceRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceIncident" ADD CONSTRAINT "MaintenanceIncident_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "MaintenanceRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceIncident" ADD CONSTRAINT "MaintenanceIncident_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceIncident" ADD CONSTRAINT "MaintenanceIncident_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Composite indexes backing the hot queries added with this feature: the
-- maintenance scanner filters consultations by status+date, the ambulance
-- dispatch queue filters by status, and the support SLA rule filters tickets
-- by status+age.
CREATE INDEX "Consultation_status_date_idx" ON "Consultation"("status", "date");
CREATE INDEX "AmbulanceRequest_status_idx" ON "AmbulanceRequest"("status");
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");
