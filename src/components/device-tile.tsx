import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/smart-home';
import type { Device } from '@/models/IoTModels';

type Props = {
  device: Device;
  updating: boolean;
  disabled?: boolean;
  onToggle?: (status: boolean) => void;
};

export function DeviceTile({ device, updating, disabled = false, onToggle }: Props) {
  const inactive = disabled || updating || !onToggle;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={device.name}
      accessibilityState={{ checked: device.status, disabled: inactive, busy: updating }}
      disabled={inactive}
      onPress={() => onToggle?.(!device.status)}
      style={({ pressed }) => [styles.tile, (pressed || disabled) && styles.dimmed]}>
      <View style={[styles.iconWrap, device.status && styles.iconWrapActive]}>
        <Ionicons name={device.icon} size={24} color={device.status ? Palette.accent : Palette.muted} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {device.name}
      </Text>
      <Text style={[styles.status, device.status && styles.statusActive]}>
        {updating ? 'Updating...' : device.status ? 'ON' : 'OFF'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    // A fixed aspectRatio made the tile too short on narrow screens (3 tiles
    // per row), so the icon, name and status overlapped. Use a minimum height
    // instead so the tile grows with its content.
    minHeight: 122,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: Palette.surface,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.mutedSurface,
  },
  iconWrapActive: {
    backgroundColor: Palette.accentSurface,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.text,
    maxWidth: '100%',
    textAlign: 'center',
  },
  status: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.muted,
  },
  statusActive: {
    color: Palette.accent,
  },
  dimmed: {
    opacity: 0.6,
  },
});
