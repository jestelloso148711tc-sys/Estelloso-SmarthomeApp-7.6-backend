require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

function formatDevice(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    status: row.status === 1,
  };
}

app.post('/gateway/connect', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ connected: true });
  } catch (err) {
    res.status(500).json({ error: 'Unable to reach the database' });
  }
});

app.get('/devices', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM devices');
    res.json(rows.map(formatDevice));
  } catch (err) {
    res.status(500).json({ error: 'Unable to load devices' });
  }
});

app.get('/devices/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM devices WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json(formatDevice(rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Unable to load device' });
  }
});

app.patch('/devices/:id', async (req, res) => {
  const { status } = req.body;
  if (typeof status !== 'boolean') {
    return res.status(400).json({ error: 'status must be true or false' });
  }
  try {
    const [result] = await db.query('UPDATE devices SET status = ? WHERE id = ?', [
      status ? 1 : 0,
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    const [rows] = await db.query('SELECT * FROM devices WHERE id = ?', [req.params.id]);
    res.json(formatDevice(rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Unable to update device' });
  }
});

app.get('/sensors', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT temperature, humidity FROM sensor_readings ORDER BY recorded_at DESC, id DESC LIMIT 1'
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No sensor readings yet' });
    }
    res.json({
      temperature: Number(rows[0].temperature),
      humidity: Number(rows[0].humidity),
      lightLevel: 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Unable to retrieve sensor data' });
  }
});

app.get('/sensors/history', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 1000);
  try {
    const [rows] = await db.query(
      'SELECT * FROM sensor_readings ORDER BY recorded_at DESC, id DESC LIMIT ?',
      [limit]
    );
    res.json(
      rows.map((row) => ({
        id: row.id,
        temperature: Number(row.temperature),
        humidity: Number(row.humidity),
        deviceId: row.device_id,
        recordedAt: row.recorded_at,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Unable to load readings' });
  }
});

app.post('/sensors', async (req, res) => {
  const { temperature, humidity, device_id } = req.body;
  if (typeof temperature !== 'number' || typeof humidity !== 'number') {
    return res.status(400).json({ error: 'temperature and humidity must be numbers' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO sensor_readings (temperature, humidity, device_id) VALUES (?, ?, ?)',
      [temperature, humidity, device_id || 'esp32-smarthome-01']
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Unable to save reading' });
  }
});

app.get('/preferences', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT notifications_enabled FROM preferences WHERE id = 1');
    res.json({ notificationsEnabled: rows[0].notifications_enabled === 1 });
  } catch (err) {
    res.status(500).json({ error: 'Unable to load preferences' });
  }
});

app.patch('/preferences', async (req, res) => {
  const { notificationsEnabled } = req.body;
  if (typeof notificationsEnabled !== 'boolean') {
    return res.status(400).json({ error: 'notificationsEnabled must be true or false' });
  }
  try {
    await db.query('UPDATE preferences SET notifications_enabled = ? WHERE id = 1', [
      notificationsEnabled ? 1 : 0,
    ]);
    res.json({ notificationsEnabled });
  } catch (err) {
    res.status(500).json({ error: 'Unable to save preferences' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
