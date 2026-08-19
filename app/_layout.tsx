import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider } from '@/state/app-state';
import { theme } from '@/lib/theme';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.bg }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]" options={{ title: '', headerTransparent: true, headerTintColor: '#FFFFFF' }} />
        <Stack.Screen name="cooking/[id]" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="import/index" options={{ title: 'Rezept importieren', presentation: 'modal' }} />
        <Stack.Screen name="search/index" options={{ title: 'Rezept suchen', presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ title: 'Einstellungen' }} />
      </Stack>
    </AppStateProvider>
  );
}
