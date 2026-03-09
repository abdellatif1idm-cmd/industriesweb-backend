-- CreateTable
CREATE TABLE "press_accreditations" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "media" TEXT NOT NULL,
    "fonction" TEXT NOT NULL,
    "website" TEXT,
    "coverage" TEXT[],
    "interview" BOOLEAN NOT NULL,
    "pressCardUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "press_accreditations_pkey" PRIMARY KEY ("id")
);

CREATE OR REPLACE VIEW stats_view AS
SELECT
  (SELECT COUNT(*)                           FROM submissions)          AS submissions_total,
  (SELECT COUNT(*) FROM submissions          WHERE read = false)        AS submissions_unread,
  (SELECT COUNT(*)                           FROM press_accreditations) AS press_total,
  (SELECT COUNT(*) FROM press_accreditations WHERE read = false)        AS press_unread,
  (SELECT COUNT(*) FROM press_accreditations WHERE status = 'pending')  AS press_pending,
  (SELECT COUNT(*) FROM press_accreditations WHERE status = 'approved') AS press_approved,
  (SELECT COUNT(*) FROM press_accreditations WHERE status = 'rejected') AS press_rejected;