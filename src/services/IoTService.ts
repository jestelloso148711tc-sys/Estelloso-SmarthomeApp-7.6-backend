import { request } from '@/services/api/client';
import { USE_MOCK_API } from '@/services/api/config';
import * as mockApi from '@/services/mock/mockIoTApi';
import type { Device, SensorData, UserPreferences } from '@/models/IoTModels';

// Single entry point the rest of the app uses for data. The exported function
// names and signatures are the contract: the context and screens never know
// whether a mock or a real backend answers.
//
// With no EXPO_PUBLIC_API_BASE_URL the in-memory mock API is used. Once it is
// set, the HTTP branches below run. The endpoint paths and response shapes are
// ASSUMPTIONS - adjust them to match the real backend when it exists.

export async function connectGateway(): Promise<void> {
  if (USE_MOCK_API) return mockApi.connectGateway();
  await request<void>('/gateway/connect', { method: 'POST' });
}

export async function getDevices(): Promise<Device[]> {
  if (USE_MOCK_API) return mockApi.getDevices();
  return request<Device[]>('/devices');
}

export async function getSensorData(): Promise<SensorData> {
  if (USE_MOCK_API) return mockApi.getSensorData();
  return request<SensorData>('/sensors');
}

export async function updateDeviceStatus(id: number, status: boolean): Promise<Device> {
  if (USE_MOCK_API) return mockApi.updateDeviceStatus(id, status);
  return request<Device>(`/devices/${id}`, { method: 'PATCH', body: { status } });
}

export async function getPreferences(): Promise<UserPreferences> {
  if (USE_MOCK_API) return mockApi.getPreferences();
  return request<UserPreferences>('/preferences');
}

export async function updatePreferences(changes: Partial<UserPreferences>): Promise<UserPreferences> {
  if (USE_MOCK_API) return mockApi.updatePreferences(changes);
  return request<UserPreferences>('/preferences', { method: 'PATCH', body: changes });
}
