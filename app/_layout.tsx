import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { databaseService } from '@/src/services/DatabaseService';
import { useAppStore } from '@/src/store';
import { ThemeProvider as DesignThemeProvider, Colors as DesignColors } from '@/src/design-system';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const { setInitialized, setError } = useAppStore();

  useEffect(() => {
    console.log(`🚀 [RootLayout] App initialization starting...`);
    initializeApp();
  }, []);

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
    }
  };

  if (isInitializing) {
    return (
      <DesignThemeProvider mode={colorScheme === 'dark' ? 'dark' : 'light'}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignColors.sage} />
          <Text style={styles.loadingText}>Initializing Mine...</Text>
        </View>
      </DesignThemeProvider>
    );
  }

  if (initError) {
    return (
      <DesignThemeProvider mode={colorScheme === 'dark' ? 'dark' : 'light'}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Initialization Error</Text>
          <Text style={styles.errorMessage}>{initError}</Text>
        </View>
      </DesignThemeProvider>
    );
  }

  return (
    <KeyboardProvider>
      <DesignThemeProvider mode={colorScheme === 'dark' ? 'dark' : 'light'}>
        {console.log(`🚀 [RootLayout] Rendering app with KeyboardProvider and theme: ${colorScheme}`)}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="camera" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="post-capture" options={{ headerShown: false }} />
          <Stack.Screen name="create-project" options={{ headerShown: false }} />
          <Stack.Screen name="project/[id]" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </DesignThemeProvider>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignColors.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: DesignColors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignColors.white,
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DesignColors.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: DesignColors.textSecondary,
    textAlign: 'center',
  },
});
