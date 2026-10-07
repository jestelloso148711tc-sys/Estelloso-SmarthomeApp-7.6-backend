# Smart Home App

Expo (React Native) + Expo Router app for monitoring and controlling a smart home:
Dashboard, Devices, Sensors and Settings, in a drawer navigator.

## Run

```bash
npm install
npx expo start        # then press a / i / w, or scan the QR code with Expo Go
npx tsc --noEmit      # typecheck
npx expo lint         # lint
```

## Structure

```
src/app/         Screens (Expo Router): index, devices, sensors, settings, _layout
src/components/  UI pieces (Screen, DeviceRow, DeviceTile, SensorCard, SettingRow,
                 StatusBanner, GatewayBanner, EmptyState)
src/context/     IoTContext: app state, loading/error state, optimistic updates
src/services/    IoTService.ts = the only data entry point used by the context
  api/           config.ts (env), client.ts (fetch wrapper)
  mock/          mockData.ts + mockIoTApi.ts (in-memory fake backend)
src/models/      Shared types
src/constants/   Palette
```

## Mock API vs. real backend

With no `EXPO_PUBLIC_API_BASE_URL`, everything runs against `src/services/mock`
(simulated latency and random failures, so loading and error states are visible).
Set the variable (see `.env.example`) and `IoTService.ts` calls the backend instead.
Assumed endpoints (edit `IoTService.ts` to match the real API):

| Function             | Request                         |
| -------------------- | ------------------------------- |
| `connectGateway`     | `POST /gateway/connect`         |
| `getDevices`         | `GET /devices`                  |
| `updateDeviceStatus` | `PATCH /devices/:id` `{status}` |
| `getSensorData`      | `GET /sensors`                  |
| `getPreferences`     | `GET /preferences`              |
| `updatePreferences`  | `PATCH /preferences`            |
