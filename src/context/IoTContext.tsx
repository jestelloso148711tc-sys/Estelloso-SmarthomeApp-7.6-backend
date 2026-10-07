import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import type { Device, SensorData } from '@/models/IoTModels';
import * as IoTService from '@/services/IoTService';

export type TemperatureUnit = '°C' | '°F';

type IoTContextValue = {
  devices: Device[];
  devicesLoading: boolean;
  devicesError: string | null;
  updatingDeviceIds: number[];
  deviceErrors: Record<number, string>;
  sensorData: SensorData | null;
  sensorsLoading: boolean;
  sensorsError: string | null;
  sensorsUpdatedAt: Date | null;
  gatewayConnected: boolean;
  gatewayConnecting: boolean;
  gatewayError: string | null;
  temperatureUnit: TemperatureUnit;
  notificationsEnabled: boolean;
  notificationsSaving: boolean;
  notificationsError: string | null;
  loadDevices: () => Promise<void>;
  setDeviceStatus: (id: number, status: boolean) => Promise<void>;
  refreshSensors: () => Promise<void>;
  connectGateway: () => Promise<void>;
  disconnectGateway: () => void;
  toggleTemperatureUnit: () => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
};

const IoTContext = createContext<IoTContextValue | null>(null);

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function IoTProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [devicesError, setDevicesError] = useState<string | null>(null);
  const [updatingDeviceIds, setUpdatingDeviceIds] = useState<number[]>([]);
  const [deviceErrors, setDeviceErrors] = useState<Record<number, string>>({});

  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [sensorsLoading, setSensorsLoading] = useState(false);
  const [sensorsError, setSensorsError] = useState<string | null>(null);
  const [sensorsUpdatedAt, setSensorsUpdatedAt] = useState<Date | null>(null);

  const [gatewayConnected, setGatewayConnected] = useState(true);
  const [gatewayConnecting, setGatewayConnecting] = useState(false);
  const [gatewayError, setGatewayError] = useState<string | null>(null);

  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('°C');

  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [notificationsSaving, setNotificationsSaving] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);

  async function loadDevices() {
    setDevicesLoading(true);
    setDevicesError(null);
    try {
      setDevices(await IoTService.getDevices());
    } catch (error) {
      setDevicesError(errorMessage(error, 'Unable to load devices.'));
    } finally {
      setDevicesLoading(false);
    }
  }

  async function refreshSensors() {
    if (!gatewayConnected) {
      setSensorsError('IoT Gateway is disconnected.');
      return;
    }
    setSensorsLoading(true);
    setSensorsError(null);
    try {
      setSensorData(await IoTService.getSensorData());
      setSensorsUpdatedAt(new Date());
    } catch {
      setSensorsError('Unable to retrieve sensor data.');
    } finally {
      setSensorsLoading(false);
    }
  }

  function applyStatus(id: number, status: boolean) {
    setDevices((current) =>
      current.map((device) => (device.id === id ? { ...device, status } : device))
    );
  }

  async function setDeviceStatus(id: number, status: boolean) {
    const device = devices.find((item) => item.id === id);
    if (!device || !gatewayConnected || updatingDeviceIds.includes(id)) {
      return;
    }

    applyStatus(id, status);
    setUpdatingDeviceIds((ids) => [...ids, id]);
    setDeviceErrors(({ [id]: _, ...rest }) => rest);

    try {
      await IoTService.updateDeviceStatus(id, status);
    } catch (error) {
      applyStatus(id, !status);
      setDeviceErrors((errors) => ({
        ...errors,
        [id]: errorMessage(error, `Unable to update ${device.name}.`),
      }));
    } finally {
      setUpdatingDeviceIds((ids) => ids.filter((item) => item !== id));
    }
  }

  async function connectGateway() {
    setGatewayConnecting(true);
    setGatewayError(null);
    try {
      await IoTService.connectGateway();
      setGatewayConnected(true);
      setSensorsError(null);
    } catch (error) {
      setGatewayError(errorMessage(error, 'Unable to reach the IoT Gateway.'));
    } finally {
      setGatewayConnecting(false);
    }
  }

  function disconnectGateway() {
    setGatewayConnected(false);
    setGatewayError(null);
  }

  async function loadPreferences() {
    try {
      const preferences = await IoTService.getPreferences();
      setNotificationsEnabledState(preferences.notificationsEnabled);
    } catch {
      // Keep the defaults; preferences are non-critical on first load.
    }
  }

  async function setNotificationsEnabled(enabled: boolean) {
    if (notificationsSaving) {
      return;
    }
    const previous = notificationsEnabled;
    setNotificationsEnabledState(enabled);
    setNotificationsSaving(true);
    setNotificationsError(null);
    try {
      await IoTService.updatePreferences({ notificationsEnabled: enabled });
    } catch (error) {
      setNotificationsEnabledState(previous);
      setNotificationsError(errorMessage(error, 'Unable to save your settings.'));
    } finally {
      setNotificationsSaving(false);
    }
  }

  function toggleTemperatureUnit() {
    setTemperatureUnit((unit) => (unit === '°C' ? '°F' : '°C'));
  }

  useEffect(() => {
    loadDevices();
    refreshSensors();
    loadPreferences();
    // Initial fetch only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IoTContext.Provider
      value={{
        devices,
        devicesLoading,
        devicesError,
        updatingDeviceIds,
        deviceErrors,
        sensorData,
        sensorsLoading,
        sensorsError,
        sensorsUpdatedAt,
        gatewayConnected,
        gatewayConnecting,
        gatewayError,
        temperatureUnit,
        notificationsEnabled,
        notificationsSaving,
        notificationsError,
        loadDevices,
        setDeviceStatus,
        refreshSensors,
        connectGateway,
        disconnectGateway,
        toggleTemperatureUnit,
        setTemperatureUnit,
        setNotificationsEnabled,
      }}>
      {children}
    </IoTContext.Provider>
  );
}

export function useIoT() {
  const context = useContext(IoTContext);
  if (!context) {
    throw new Error('useIoT must be used inside an IoTProvider.');
  }
  return context;
}

export function formatTemperature(celsius: number, unit: TemperatureUnit) {
  const value = unit === '°C' ? celsius : Math.round((celsius * 9) / 5 + 32);
  return `${value} ${unit}`;
}
