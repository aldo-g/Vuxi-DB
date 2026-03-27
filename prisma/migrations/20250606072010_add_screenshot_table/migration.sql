/*
  Warnings:

  - You are about to drop the column `screenshotUrl` on the `AnalyzedPage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,baseUrl]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AnalyzedPage" DROP COLUMN "screenshotUrl";

-- CreateTable
CREATE TABLE "Screenshot" (
    "id" SERIAL NOT NULL,
    "analyzedPageId" INTEGER NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "viewport" TEXT,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Screenshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_userId_baseUrl_key" ON "Project"("userId", "baseUrl");

-- AddForeignKey
ALTER TABLE "Screenshot" ADD CONSTRAINT "Screenshot_analyzedPageId_fkey" FOREIGN KEY ("analyzedPageId") REFERENCES "AnalyzedPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
