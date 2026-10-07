import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { SettingRow } from '@/components/setting-row';
import { StatusBanner } from '@/components/status-banner';
import { Palette } from '@/constants/smart-home';
import { useIoT, type TemperatureUnit } from '@/context/IoTContext';

const TemperatureUnits: TemperatureUnit[] = ['°C', '°F'];

export default function SettingsScreen() {
  const {
    gatewayConnected,
    gatewayConnecting,
    gatewayError,
    temperatureUnit,
    notificationsEnabled,
    notificationsSaving,
    notificationsError,
    connectGateway,
    disconnectGateway,
    setTemperatureUnit,
    setNotificationsEnabled,
  } = useIoT();

  return (
    <Screen gap={24}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.rows}>
        <SettingRow
          label="IoT Gateway"
          hint={gatewayConnecting ? 'Connecting...' : gatewayConnected ? 'Connected' : 'Disconnected'}>
          {gatewayConnecting ? (
            <ActivityIndicator color={Palette.text} />
          ) : (
            <Switch
              accessibilityLabel="IoT Gateway connection"
              value={gatewayConnected}
              onValueChange={(on) => (on ? connectGateway() : disconnectGateway())}
              trackColor={{ false: Palette.track, true: Palette.accent }}
              thumbColor={Palette.header}
              ios_backgroundColor={Palette.track}
            />
          )}
        </SettingRow>

        <SettingRow label="Notifications" hint={notificationsSaving ? 'Saving...' : undefined}>
          <Switch
            accessibilityLabel="Notifications"
            value={notificationsEnabled}
            disabled={notificationsSaving}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: Palette.track, true: Palette.accent }}
            thumbColor={Palette.header}
            ios_backgroundColor={Palette.track}
          />
        </SettingRow>

        <SettingRow label="Temperature Unit">
          <View accessibilityRole="radiogroup" style={styles.segmented}>
            {TemperatureUnits.map((unit) => {
              const selected = unit === temperatureUnit;
              return (
                <Pressable
                  key={unit}
                  accessibilityRole="radio"
                  accessibilityLabel={unit === '°C' ? 'Celsius' : 'Fahrenheit'}
                  accessibilityState={{ selected }}
                  hitSlop={6}
                  onPress={() => setTemperatureUnit(unit)}
                  style={[styles.segment, selected && styles.segmentSelected]}>
                  <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                    {unit}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </SettingRow>
      </View>

      {gatewayError ? (
        <StatusBanner message={gatewayError} busy={gatewayConnecting} onAction={connectGateway} />
      ) : null}

      {notificationsError ? (
        <StatusBanner
          message={notificationsError}
          busy={notificationsSaving}
          onAction={() => setNotificationsEnabled(!notificationsEnabled)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.text,
  },
  rows: {
    marginTop: 16,
  },
  segmented: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    backgroundColor: Palette.background,
  },
  segment: {
    minWidth: 48,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 9,
  },
  segmentSelected: {
    backgroundColor: Palette.accent,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.muted,
  },
  segmentTextSelected: {
    color: Palette.background,
  },
});
