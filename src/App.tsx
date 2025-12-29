import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { TabNavigator } from './navigation';
import { databaseService } from './services/DatabaseService';
import { useAppStore } from './store';
import { ThemeProvider, Colors } from './design-system';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const { setInitialized, setError } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsInitializing(true);
      setInitError(null);

      // Initialize database
      await databaseService.initialize();
      
      // Mark app as initialized
      setInitialized(true);
      
      console.log('Mine app initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      console.error('Failed to initialize app:', errorMessage);
      setInitError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  };

  if (isInitializing) {
    return (
      <ThemeProvider mode="light">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.sage} />
          <Text style={styles.loadingText}>Initializing Mine...</Text>
        </View>
      </ThemeProvider>
    );
  }

  if (initError) {
    return (
      <ThemeProvider mode="light">
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Initialization Error</Text>
          <Text style={styles.errorMessage}>{initError}</Text>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider mode="light">
      <NavigationContainer>
        <StatusBar style="auto" />
        <TabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});