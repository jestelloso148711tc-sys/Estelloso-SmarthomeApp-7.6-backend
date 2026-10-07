import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/smart-home';

export function SettingRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.labels}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: Palette.surface,
  },
  labels: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 19,
    fontWeight: '700',
    color: Palette.text,
  },
  hint: {
    fontSize: 14,
    color: Palette.muted,
  },
});
