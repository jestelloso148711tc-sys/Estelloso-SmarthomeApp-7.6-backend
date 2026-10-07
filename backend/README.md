# Backend

Node.js + Express + MySQL REST API for the smart home app.

## Run

1. In MySQL Workbench, run `database/schema.sql` and then `database/seed.sql`.
2. Copy `.env.example` to `.env` and set your MySQL password.
3. In this folder:

```
npm install
npm start
```

The API runs on http://localhost:3000.

## Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | /gateway/connect | Checks the database connection |
| GET | /devices | List devices |
| GET | /devices/:id | Get one device |
| PATCH | /devices/:id | Turn a device on or off, body `{ "status": true }` |
| GET | /sensors | Latest temperature and humidity |
| GET | /sensors/history?limit=50 | Past readings |
| POST | /sensors | Save a reading from the ESP32 |
| GET | /preferences | Get preferences |
| PATCH | /preferences | Update preferences, body `{ "notificationsEnabled": true }` |

ESP32 body for `POST /sensors`:

```
{ "temperature": 26.1, "humidity": 51, "device_id": "esp32-smarthome-01" }
```

## Connect the app

In the app's `.env` set `EXPO_PUBLIC_API_BASE_URL=http://YOUR_PC_IP:3000`, then restart with `npx expo start -c`.
