-- Garante que ocupação por tipo de quarto só conta reservas do mesmo lodging_type (hotel vs daycare).
CREATE OR REPLACE VIEW vw_room_type_availability AS
SELECT
  rt.company_id,
  rt.id            AS room_type_id,
  rt.lodging_type,
  rt.name          AS room_type_name,
  rt.daily_rate,
  rt.capacity      AS total_capacity,
  d.check_date,
  CASE
    WHEN bh.id IS NULL
      OR bh.is_closed = TRUE
      OR bh.open_time IS NULL
      OR bh.close_time IS NULL
    THEN 0
    ELSE COUNT(r.id)::int
  END                                                                  AS occupied_capacity,
  CASE
    WHEN bh.id IS NULL
      OR bh.is_closed = TRUE
      OR bh.open_time IS NULL
      OR bh.close_time IS NULL
    THEN 0
    ELSE GREATEST(0, rt.capacity - COUNT(r.id))::int
  END                                                                  AS available_capacity
FROM petshop_room_types rt
CROSS JOIN (
  SELECT generate_series(
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '180 days',
    INTERVAL '1 day'
  )::date AS check_date
) AS d
LEFT JOIN petshop_business_hours bh
  ON bh.company_id  = rt.company_id
 AND bh.day_of_week = EXTRACT(DOW FROM d.check_date)::int
LEFT JOIN petshop_lodging_reservations r
  ON r.room_type_id   = rt.id
 AND r.company_id     = rt.company_id
 AND r.type           = rt.lodging_type
 AND r.checkin_date  <= d.check_date
 AND r.checkout_date >  d.check_date
 AND r.status IN ('confirmed', 'checked_in')
WHERE rt.is_active = TRUE
GROUP BY
  rt.company_id,
  rt.id,
  rt.lodging_type,
  rt.name,
  rt.daily_rate,
  rt.capacity,
  d.check_date,
  bh.id,
  bh.is_closed,
  bh.open_time,
  bh.close_time;
