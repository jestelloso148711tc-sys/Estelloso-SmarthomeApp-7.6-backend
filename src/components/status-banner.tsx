import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/smart-home';

type Props = {
  message: string;
  tone?: 'error' | 'warning';
  actionLabel?: string;
  busyLabel?: string;
  busy?: boolean;
  onAction?: () => void;
};

export function StatusBanner({
  message,
  tone = 'error',
  actionLabel = 'Retry',
  busyLabel,
  busy = false,
  onAction,
}: Props) {
  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, tone === 'warning' ? styles.warning : styles.error]}>
      <Ionicons
        name={tone === 'warning' ? 'cloud-offline-outline' : 'alert-circle-outline'}
        size={22}
        color={tone === 'warning' ? Palette.warning : Palette.danger}
      />
      <Text style={[styles.message, tone === 'error' && styles.errorText]}>{message}</Text>
      {onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          disabled={busy}
          hitSlop={8}
          style={({ pressed }) => [styles.action, (pressed || busy) && styles.dimmed]}>
          {busy ? <ActivityIndicator size="small" color={Palette.text} /> : null}
          <Text style={styles.actionText}>{busy ? (busyLabel ?? actionLabel) : actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
  },
  error: {
    backgroundColor: Palette.dangerSurface,
  },
  warning: {
    backgroundColor: Palette.warningSurface,
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Palette.text,
  },
  errorText: {
    color: Palette.danger,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Palette.surface,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text,
  },
  dimmed: {
    opacity: 0.6,
  },
});
