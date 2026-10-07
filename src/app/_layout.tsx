import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { type ColorValue } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Palette } from '@/constants/smart-home';
import { IoTProvider } from '@/context/IoTContext';

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Palette.background,
    card: Palette.header,
    text: Palette.text,
    border: Palette.divider,
  },
};

type IconName = keyof typeof Ionicons.glyphMap;

function drawerIcon(active: IconName, inactive: IconName) {
  return function DrawerIcon({
    color,
    size,
    focused,
  }: {
    color: ColorValue;
    size: number;
    focused: boolean;
  }) {
    return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
  };
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={NavigationTheme}>
        <IoTProvider>
          <Drawer
            screenOptions={{
              headerStyle: { backgroundColor: Palette.header },
              headerTintColor: Palette.text,
              headerTitleAlign: 'left',
              headerTitleStyle: { fontSize: 20, fontWeight: '700' },
              headerShadowVisible: false,
              sceneStyle: { backgroundColor: Palette.background },
              drawerStyle: { backgroundColor: Palette.header },
              drawerActiveTintColor: Palette.text,
              drawerActiveBackgroundColor: Palette.background,
              drawerInactiveTintColor: Palette.muted,
              drawerLabelStyle: { fontSize: 16, fontWeight: '700' },
            }}>
            <Drawer.Screen
              name="index"
              options={{
                title: 'Smart Home',
                drawerLabel: 'Dashboard',
                drawerIcon: drawerIcon('home', 'home-outline'),
              }}
            />
            <Drawer.Screen
              name="devices"
              options={{
                title: 'Devices',
                drawerIcon: drawerIcon('grid', 'grid-outline'),
              }}
            />
            <Drawer.Screen
              name="sensors"
              options={{
                title: 'Sensors',
                drawerIcon: drawerIcon('pulse', 'pulse-outline'),
              }}
            />
            <Drawer.Screen
              name="settings"
              options={{
                title: 'Settings',
                drawerIcon: drawerIcon('settings', 'settings-outline'),
              }}
            />
          </Drawer>
        </IoTProvider>
        <StatusBar style="light" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
