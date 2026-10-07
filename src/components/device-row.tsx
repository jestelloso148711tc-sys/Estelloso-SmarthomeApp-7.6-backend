import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Palette } from '@/constants/smart-home';
import type { Device } from '@/models/IoTModels';

type Props = {
  device: Device;
  updating: boolean;
  disabled: boolean;
  error?: string;
  onToggle: (status: boolean) => void;
};

export function DeviceRow({ device, updating, disabled, error, onToggle }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, device.status && styles.iconWrapActive]}>
          <Ionicons name={device.icon} size={24} color={device.status ? Palette.accent : Palette.muted} />
        </View>
        <View style={styles.labels}>
          <Text style={styles.name}>{device.name}</Text>
          <Text style={styles.type}>{device.type}</Text>
        </View>
        <View style={styles.control}>
          <Text style={[styles.status, updating && styles.updating]}>
            {updating ? 'Updating...' : device.status ? 'ON' : 'OFF'}
          </Text>
          <Switch
            value={device.status}
            onValueChange={onToggle}
            accessibilityLabel={`${device.name}, ${device.status ? 'on' : 'off'}`}
            disabled={disabled || updating}
            trackColor={{ false: Palette.track, true: Palette.accent }}
            thumbColor={Palette.header}
            ios_backgroundColor={Palette.track}
          />
        </View>
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{error}</Text>
          {!disabled ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Retry updating ${device.name}`}
              hitSlop={8}
              onPress={() => onToggle(!device.status)}>
              <Text style={styles.retry}>Retry</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: Palette.surface,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 60,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.mutedSurface,
  },
  iconWrapActive: {
    backgroundColor: Palette.accentSurface,
  },
  labels: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.text,
  },
  type: {
    fontSize: 14,
    color: Palette.muted,
  },
  control: {
    alignItems: 'flex-end',
    gap: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text,
  },
  updating: {
    color: Palette.accent,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.danger,
  },
  retry: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text,
    textDecorationLine: 'underline',
  },
});
