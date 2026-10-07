import { MOCK_FAILURE_RATE } from '@/services/api/config';
import { mockDevices, mockPreferences, mockSensorData } from '@/services/mock/mockData';
import type { Device, SensorData, UserPreferences } from '@/models/IoTModels';

// In-memory stand-in for a backend. Behaves like the original IoTService:
// artificial latency plus random failures so loading/error states are visible.

let deviceStore: Device[] = mockDevices.map((device) => ({ ...device }));
let preferenceStore: UserPreferences = { ...mockPreferences };

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function simulateFailure(message: string) {
  if (Math.random() < MOCK_FAILURE_RATE) {
    throw new Error(message);
  }
}

function randomAround(value: number, spread: number) {
  return Math.round(value + (Math.random() * 2 - 1) * spread);
}

export async function connectGateway(): Promise<void> {
  await delay(1200);
  simulateFailure('Unable to reach the IoT Gateway.');
}

export async function getDevices(): Promise<Device[]> {
  await delay(1500);
  simulateFailure('Unable to load devices.');
  return deviceStore.map((device) => ({ ...device }));
}

export async function getSensorData(): Promise<SensorData> {
  await delay(1500);
  simulateFailure('Unable to retrieve sensor data.');
  return {
    temperature: randomAround(mockSensorData.temperature, 3),
    humidity: randomAround(mockSensorData.humidity, 10),
    lightLevel: randomAround(mockSensorData.lightLevel, 200),
  };
}

export async function updateDeviceStatus(id: number, status: boolean): Promise<Device> {
  await delay(1000);
  const device = deviceStore.find((item) => item.id === id);
  if (!device) {
    throw new Error('Device not found.');
  }
  simulateFailure(`Unable to update ${device.name}.`);

  deviceStore = deviceStore.map((item) => (item.id === id ? { ...item, status } : item));
  return { ...device, status };
}

export async function getPreferences(): Promise<UserPreferences> {
  await delay(300);
  return { ...preferenceStore };
}

export async function updatePreferences(changes: Partial<UserPreferences>): Promise<UserPreferences> {
  await delay(300);
  simulateFailure('Unable to save your settings.');
  preferenceStore = { ...preferenceStore, ...changes };
  return { ...preferenceStore };
}
