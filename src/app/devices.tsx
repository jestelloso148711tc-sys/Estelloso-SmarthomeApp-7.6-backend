import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { DeviceRow } from '@/components/device-row';
import { EmptyState } from '@/components/empty-state';
import { GatewayBanner } from '@/components/gateway-banner';
import { Screen } from '@/components/screen';
import { StatusBanner } from '@/components/status-banner';
import { Palette } from '@/constants/smart-home';
import { useIoT } from '@/context/IoTContext';

export default function DevicesScreen() {
  const {
    devices,
    devicesLoading,
    devicesError,
    updatingDeviceIds,
    deviceErrors,
    gatewayConnected,
    loadDevices,
    setDeviceStatus,
  } = useIoT();

  const activeCount = devices.filter((device) => device.status).length;

  return (
    <Screen refreshing={devicesLoading && devices.length > 0} onRefresh={loadDevices}>
      <View>
        <Text style={styles.title}>My Devices</Text>
        {devices.length > 0 ? (
          <Text style={styles.subtitle}>
            {activeCount} of {devices.length} on
          </Text>
        ) : null}
      </View>

      <GatewayBanner />

      {devicesError ? (
        <StatusBanner
          message={devicesError}
          busy={devicesLoading}
          busyLabel="Loading..."
          onAction={loadDevices}
        />
      ) : null}

      {devicesLoading && devices.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Palette.text} />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
      ) : devices.length === 0 && !devicesError ? (
        <EmptyState
          icon="grid-outline"
          title="No devices found"
          message="Devices connected to your IoT Gateway will appear here."
          actionLabel="Refresh"
          onAction={loadDevices}
        />
      ) : (
        <View style={styles.list}>
          {devices.map((device) => (
            <DeviceRow
              key={device.id}
              device={device}
              updating={updatingDeviceIds.includes(device.id)}
              disabled={!gatewayConnected}
              error={deviceErrors[device.id]}
              onToggle={(status) => setDeviceStatus(device.id, status)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.muted,
  },
  list: {
    gap: 12,
  },
  loading: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.muted,
  },
});
