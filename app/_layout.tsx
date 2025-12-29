import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useFonts, NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { databaseService } from '@/src/services/DatabaseService';
import { useAppStore } from '@/src/store';
import { ThemeProvider as DesignThemeProvider, Colors as DesignColors, getTheme, Theme } from '@/src/design-system';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const { setInitialized, setError } = useAppStore();

  // Load fonts
  const [fontsLoaded] = useFonts({
    NanumPenScript_400Regular,
  });

  // Get theme-aware colors (default to light for Soft-Tech aesthetic)
  const theme = getTheme('light');
  const styles = createStyles(theme);

  useEffect(() => {
    if (fontsLoaded) {
      console.log(`🚀 [RootLayout] App initialization starting...`);
      initializeApp();
    }
  }, [fontsLoaded]);

  const initializeApp = async () => {
    try {
      setIsInitializing(true);
      setInitError(null);

      console.log(`🚀 [RootLayout] Initializing database...`);
      // Initialize database
      await databaseService.initialize();
      
      // Mark app as initialized
      setInitialized(true);
      
      console.log('🚀 [RootLayout] Mine app initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      console.error('🚀 [RootLayout] Failed to initialize app:', errorMessage);
      setInitError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsInitializing(false);
      // Hide splash screen after initialization
      await SplashScreen.hideAsync();
    }
  };

  // Don't render anything until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  if (isInitializing) {
    return (
      <DesignThemeProvider mode="light">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.textPrimary} />
          <Text style={styles.loadingText}>Initializing Mine...</Text>
        </View>
      </DesignThemeProvider>
    );
  }

  if (initError) {
    return (
      <DesignThemeProvider mode="light">
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Initialization Error</Text>
          <Text style={styles.errorMessage}>{initError}</Text>
        </View>
      </DesignThemeProvider>
    );
  }

  // Log the rendering (moved outside JSX)
  console.log(`🚀 [RootLayout] Rendering app with KeyboardProvider and theme: ${colorScheme}`);

  return (
    <KeyboardProvider>
      <DesignThemeProvider mode="light">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="camera" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="post-capture" options={{ headerShown: false }} />
          <Stack.Screen name="create-project" options={{ headerShown: false }} />
          <Stack.Screen name="project/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="calendar-demo" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </DesignThemeProvider>
    </KeyboardProvider>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
