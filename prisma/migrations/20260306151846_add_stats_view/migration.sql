CREATE OR REPLACE VIEW stats_view AS
SELECT
  (SELECT COUNT(*)                           FROM submissions)          AS submissions_total,
  (SELECT COUNT(*) FROM submissions          WHERE read = false)        AS submissions_unread,
  (SELECT COUNT(*)                           FROM press_accreditations) AS press_total,
  (SELECT COUNT(*) FROM press_accreditations WHERE read = false)        AS press_unread,
  (SELECT COUNT(*) FROM press_accreditations WHERE status = 'pending')  AS press_pending,
  (SELECT COUNT(*) FROM press_accreditations WHERE status = 'approved') AS press_approved,
  (SELECT COUNT(*) FROM press_accreditations WHERE status = 'rejected') AS press_rejected;