import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { GatewayBanner } from '@/components/gateway-banner';
import { Screen } from '@/components/screen';
import { SensorCard } from '@/components/sensor-card';
import { StatusBanner } from '@/components/status-banner';
import { Palette } from '@/constants/smart-home';
import { formatTemperature, useIoT } from '@/context/IoTContext';

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function SensorsScreen() {
  const {
    sensorData,
    sensorsLoading,
    sensorsError,
    sensorsUpdatedAt,
    gatewayConnected,
    temperatureUnit,
    refreshSensors,
  } = useIoT();

  const refreshDisabled = sensorsLoading || !gatewayConnected;

  return (
    <Screen refreshing={sensorsLoading && sensorData !== null} onRefresh={refreshSensors}>
      <View>
        <Text style={styles.title}>Sensors</Text>
        {sensorsUpdatedAt ? (
          <Text style={styles.subtitle}>Updated {formatTime(sensorsUpdatedAt)}</Text>
        ) : null}
      </View>

      <GatewayBanner />

      {sensorsError && gatewayConnected ? (
        <StatusBanner message={sensorsError} busy={sensorsLoading} onAction={refreshSensors} />
      ) : null}

      <View style={styles.cards}>
        <SensorCard
          label="Temperature"
          icon="thermometer-outline"
          value={sensorData ? formatTemperature(sensorData.temperature, temperatureUnit) : '--'}
        />
        <SensorCard
          label="Humidity"
          icon="water-outline"
          value={sensorData ? `${sensorData.humidity} %` : '--'}
        />
        <SensorCard
          label="Light Level"
          icon="sunny-outline"
          value={sensorData ? `${sensorData.lightLevel} lux` : '--'}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: refreshDisabled, busy: sensorsLoading }}
        onPress={refreshSensors}
        disabled={refreshDisabled}
        style={({ pressed }) => [styles.button, (pressed || refreshDisabled) && styles.dimmed]}>
        {sensorsLoading ? (
          <ActivityIndicator color={Palette.background} />
        ) : (
          <Ionicons name="refresh" size={20} color={Palette.background} />
        )}
        <Text style={styles.buttonText}>
          {sensorsLoading ? 'Refreshing Sensors...' : 'Refresh Sensors'}
        </Text>
      </Pressable>
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
  cards: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: Palette.accent,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.background,
  },
  dimmed: {
    opacity: 0.6,
  },
});
