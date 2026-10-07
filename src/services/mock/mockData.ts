import type { Device, SensorData, UserPreferences } from '@/models/IoTModels';

// MOCK DATA - demo only. Replaced by real API responses when a backend exists
// (see src/services/IoTService.ts).

export const mockDevices: Device[] = [
  { id: 1, name: 'Living Room Light', type: 'Smart Light', icon: 'bulb-outline', status: true },
  { id: 2, name: 'Bedroom Fan', type: 'Smart Fan', icon: 'sync-outline', status: false },
  { id: 3, name: 'Front Door Lock', type: 'Smart Lock', icon: 'lock-closed-outline', status: true },
];

export const mockSensorData: SensorData = {
  temperature: 28,
  humidity: 65,
  lightLevel: 720,
};

export const mockPreferences: UserPreferences = {
  notificationsEnabled: false,
};
