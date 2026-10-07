import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { DeviceTile } from '@/components/device-tile';
import { EmptyState } from '@/components/empty-state';
import { GatewayBanner } from '@/components/gateway-banner';
import { Screen } from '@/components/screen';
import { StatusBanner } from '@/components/status-banner';
import { HomeRoom, Palette } from '@/constants/smart-home';
import { formatTemperature, useIoT } from '@/context/IoTContext';

export default function DashboardScreen() {
  const {
    devices,
    devicesLoading,
    devicesError,
    updatingDeviceIds,
    sensorData,
    sensorsLoading,
    sensorsError,
    gatewayConnected,
    temperatureUnit,
    loadDevices,
    refreshSensors,
    setDeviceStatus,
  } = useIoT();

  const tiles = devices.slice(0, 3);
  const activeCount = devices.filter((device) => device.status).length;
  const refreshing = devicesLoading || sensorsLoading;

  function refreshAll() {
    loadDevices();
    refreshSensors();
  }

  return (
    <Screen gap={14} refreshing={refreshing} onRefresh={refreshAll}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Smart Home</Text>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: gatewayConnected ? Palette.success : Palette.danger },
              ]}
            />
            <Text style={styles.badgeText}>{gatewayConnected ? 'Connected' : 'Disconnected'}</Text>
          </View>
        </View>
        <Link href="/settings" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Open settings" hitSlop={12}>
            <Ionicons name="settings-outline" size={28} color={Palette.text} />
          </Pressable>
        </Link>
      </View>

      <GatewayBanner />

      {sensorsError && gatewayConnected ? (
        <StatusBanner message={sensorsError} busy={sensorsLoading} onAction={refreshSensors} />
      ) : null}

      <View style={styles.summaryRow}>
        <Link href="/sensors" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View sensor readings"
            style={styles.thermostat}>
            <Ionicons name="thermometer-outline" size={28} color={Palette.text} />
            {sensorData ? (
              <Text style={styles.temperature}>
                {formatTemperature(sensorData.temperature, temperatureUnit)}
              </Text>
            ) : sensorsLoading ? (
              <ActivityIndicator size="small" color={Palette.text} />
            ) : (
              <Text style={styles.temperature}>--</Text>
            )}
            <Text style={styles.room}>{HomeRoom}</Text>
            {sensorData ? (
              <Text style={styles.subReading}>
                {sensorData.humidity}% · {sensorData.lightLevel} lux
              </Text>
            ) : null}
          </Pressable>
        </Link>

        <View style={styles.statCard}>
          <Ionicons name="flash-outline" size={28} color={Palette.accent} />
          <Text style={styles.statNumber}>
            {activeCount}
            <Text style={styles.statTotal}>/{devices.length}</Text>
          </Text>
          <Text style={styles.statLabel}>Devices On</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Devices</Text>
        <Link href="/devices" asChild>
          <Pressable accessibilityRole="link" hitSlop={8}>
            <Text style={styles.viewAll}>View All →</Text>
          </Pressable>
        </Link>
      </View>

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
          title="No devices yet"
          message="Devices connected to your IoT Gateway will appear here."
          actionLabel="Refresh"
          onAction={loadDevices}
        />
      ) : (
        <View style={styles.deviceRow}>
          {tiles.map((device) => (
            <View key={device.id} style={styles.deviceTileWrap}>
              <DeviceTile
                device={device}
                updating={updatingDeviceIds.includes(device.id)}
                disabled={!gatewayConnected}
                onToggle={(status) => setDeviceStatus(device.id, status)}
              />
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.text,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.muted,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  thermostat: {
    flex: 1.3,
    aspectRatio: 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 18,
    borderRadius: 24,
    backgroundColor: Palette.surface,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  temperature: {
    fontSize: 40,
    fontWeight: '800',
    color: Palette.text,
  },
  room: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
  },
  subReading: {
    fontSize: 13,
    color: Palette.muted,
  },
  statCard: {
    flex: 1,
    aspectRatio: 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 18,
    borderRadius: 24,
    backgroundColor: Palette.surface,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  statNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.text,
  },
  statTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.muted,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.muted,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.text,
  },
  loading: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Palette.muted,
  },
  deviceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  deviceTileWrap: {
    flex: 1,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.accent,
  },
});
