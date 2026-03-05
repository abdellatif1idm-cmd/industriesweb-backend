/*
  Warnings:

  - You are about to drop the `contact_submissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "contact_submissions";

-- CreateTable
CREATE TABLE "submissions" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "type" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "fonction" TEXT,
    "entreprise" TEXT,
    "ville" TEXT,
    "localisation" TEXT,
    "interlocuteur" TEXT,
    "message" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);
