SELECT
  (
    SELECT
      count(*) AS count
    FROM
      submissions
  ) AS submissions_total,
  (
    SELECT
      count(*) AS count
    FROM
      submissions
    WHERE
      (submissions.read = false)
  ) AS submissions_unread,
  (
    SELECT
      count(*) AS count
    FROM
      press_accreditations
  ) AS press_total,
  (
    SELECT
      count(*) AS count
    FROM
      press_accreditations
    WHERE
      (press_accreditations.read = false)
  ) AS press_unread,
  (
    SELECT
      count(*) AS count
    FROM
      press_accreditations
    WHERE
      (press_accreditations.status = 'pending' :: text)
  ) AS press_pending,
  (
    SELECT
      count(*) AS count
    FROM
      press_accreditations
    WHERE
      (press_accreditations.status = 'approved' :: text)
  ) AS press_approved,
  (
    SELECT
      count(*) AS count
    FROM
      press_accreditations
    WHERE
      (press_accreditations.status = 'rejected' :: text)
  ) AS press_rejected;