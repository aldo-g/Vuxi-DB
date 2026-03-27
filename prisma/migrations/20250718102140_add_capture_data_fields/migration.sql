/*
  Warnings:

  - You are about to drop the column `label` on the `Screenshot` table. All the data in the column will be lost.
  - Added the required column `url` to the `Screenshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnalysisRun" ADD COLUMN     "captureJobId" TEXT;

-- AlterTable
ALTER TABLE "Screenshot" DROP COLUMN "label",
ADD COLUMN     "duration_ms" INTEGER,
ADD COLUMN     "error" TEXT,
ADD COLUMN     "filename" TEXT,
ADD COLUMN     "success" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "timestamp" TIMESTAMP(3),
ADD COLUMN     "url" TEXT NOT NULL;
