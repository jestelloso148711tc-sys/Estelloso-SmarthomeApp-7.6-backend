import { type ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/smart-home';

type Props = {
  children: ReactNode;
  gap?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
};

// Shared scrolling container: identical padding on every screen, content
// capped to a readable width on tablets/web, optional pull-to-refresh.
export function Screen({ children, gap = 16, refreshing = false, onRefresh }: Props) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Palette.accent}
            colors={[Palette.accent]}
            progressBackgroundColor={Palette.surface}
          />
        ) : undefined
      }>
      <View style={[styles.inner, { gap }]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 32,
  },
  inner: {
    width: '100%',
    maxWidth: 640,
  },
});
