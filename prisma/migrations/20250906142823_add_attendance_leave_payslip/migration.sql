-- CreateEnum
CREATE TYPE "public"."CheckinMethod" AS ENUM ('WEB', 'MOBILE', 'KIOSK');

-- CreateEnum
CREATE TYPE "public"."LeaveType" AS ENUM ('ANNUAL', 'SICK', 'UNPAID', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."AttendanceSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "clockInAt" TIMESTAMP(3) NOT NULL,
    "clockOutAt" TIMESTAMP(3),
    "minutesWorked" INTEGER,
    "note" TEXT,
    "method" "public"."CheckinMethod" NOT NULL DEFAULT 'WEB',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeaveRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."LeaveType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "reason" TEXT,
    "status" "public"."LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payslip" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "gross" DECIMAL(12,2) NOT NULL,
    "net" DECIMAL(12,2) NOT NULL,
    "items" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttendanceSession_userId_workDate_idx" ON "public"."AttendanceSession"("userId", "workDate");

-- CreateIndex
CREATE INDEX "LeaveRequest_userId_startDate_idx" ON "public"."LeaveRequest"("userId", "startDate");

-- CreateIndex
CREATE INDEX "Payslip_userId_idx" ON "public"."Payslip"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payslip_userId_year_month_key" ON "public"."Payslip"("userId", "year", "month");

-- AddForeignKey
ALTER TABLE "public"."AttendanceSession" ADD CONSTRAINT "AttendanceSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payslip" ADD CONSTRAINT "Payslip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
