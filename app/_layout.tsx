import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import "../global.css";

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="logements/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ presentation: 'modal', headerTitle: 'Notifications' }} />
      <Stack.Screen name="proximite" options={{ headerTitle: 'À proximité' }} />
      <Stack.Screen name="planning" options={{ headerTitle: 'Planning' }} />
      <Stack.Screen name="premium" options={{ headerTitle: 'Premium' }} />
      <Stack.Screen name="settings" options={{ headerTitle: 'Paramètres' }} />
      <Stack.Screen name="help" options={{ headerTitle: 'Aide' }} />
      <Stack.Screen name="offres" options={{ headerTitle: 'Offres' }} />
    </Stack>
  );
}
