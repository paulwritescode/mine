import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { FloatingTabBar, TabItem } from '@/src/components';
import { useTheme } from '@/src/design-system';

export default function TabLayout() {
  const { theme } = useTheme();

  const tabs: TabItem[] = [
    {
      key: 'index',
      title: 'Projects',
      icon: 'folder-outline',
      isActive: false, // This would be managed by router state
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      isActive: false,
    },
  ];

  const handleTabPress = (tabKey: string) => {
    switch (tabKey) {
      case 'index':
        router.push('/(tabs)');
        break;
      case 'settings':
        router.push('/(tabs)/settings');
        break;
      default:
        router.push('/(tabs)');
    }
  };

  const handleCapturePress = () => {
    router.push('/create-project');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
        tabBar={() => (
          <FloatingTabBar
            tabs={tabs}
            onTabPress={handleTabPress}
            onCapturePress={handleCapturePress}
          />
        )}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="explore" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}
