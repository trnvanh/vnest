import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { seedRealm } from '@/database/seedRealm';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    // Only seed Realm database on native platforms (iOS/Android)
    // Web platform uses WebStorageAdapter with dynamic JSON imports
    if (Platform.OS !== 'web') {
      (async () => {
        try { 
          await seedRealm(); 
        } catch (e) { 
          console.error("Error seeding Realm data: ", e); 
        }
      })();
    }
  }, []);

  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
