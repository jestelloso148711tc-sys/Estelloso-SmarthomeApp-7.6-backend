USE smarthome_iot;

INSERT INTO devices (name, type, icon, status) VALUES
  ('Living Room Light', 'Smart Light', 'bulb-outline', 1),
  ('Bedroom Fan', 'Smart Fan', 'sync-outline', 0),
  ('Front Door Lock', 'Smart Lock', 'lock-closed-outline', 1);

INSERT INTO sensor_readings (temperature, humidity, device_id, recorded_at) VALUES
  (25.60, 51.00, 'esp32-smarthome-01', '2026-10-06 10:05:13'),
  (26.20, 51.00, 'esp32-smarthome-01', '2026-10-06 10:05:15'),
  (26.30, 51.00, 'esp32-smarthome-01', '2026-10-06 10:05:17'),
  (25.70, 51.00, 'esp32-smarthome-01', '2026-10-06 10:05:19'),
  (26.20, 51.00, 'esp32-smarthome-01', '2026-10-06 10:05:21'),
  (26.10, 51.00, 'esp32-smarthome-01', '2026-10-06 10:06:16');

INSERT INTO preferences (id, notifications_enabled) VALUES (1, 0);
