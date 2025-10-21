-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "public"."TaskPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskEntry" (
    "id" TEXT NOT NULL,
    "taskPlanId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'PLANNED',
    "order" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskAttachmentLink" (
    "id" TEXT NOT NULL,
    "taskEntryId" TEXT NOT NULL,
    "label" TEXT,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskAttachmentLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskPlan_userId_workDate_idx" ON "public"."TaskPlan"("userId", "workDate");

-- CreateIndex
CREATE UNIQUE INDEX "TaskPlan_userId_workDate_key" ON "public"."TaskPlan"("userId", "workDate");

-- CreateIndex
CREATE INDEX "TaskEntry_taskPlanId_idx" ON "public"."TaskEntry"("taskPlanId");

-- CreateIndex
CREATE INDEX "TaskAttachmentLink_taskEntryId_idx" ON "public"."TaskAttachmentLink"("taskEntryId");

-- AddForeignKey
ALTER TABLE "public"."TaskPlan" ADD CONSTRAINT "TaskPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskEntry" ADD CONSTRAINT "TaskEntry_taskPlanId_fkey" FOREIGN KEY ("taskPlanId") REFERENCES "public"."TaskPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskAttachmentLink" ADD CONSTRAINT "TaskAttachmentLink_taskEntryId_fkey" FOREIGN KEY ("taskEntryId") REFERENCES "public"."TaskEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
