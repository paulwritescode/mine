import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';

import { useTheme } from '@/src/design-system';
import { DualToneProjectCard, ThemedText, BentoStatsGrid } from '@/src/components';
import { ProjectService } from '@/src/services/ProjectService';
import { Project } from '@/src/types';
import { useAppStore, useProjectStore } from '@/src/store';

export default function ProjectsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load fonts locally to ensure they're available
  const [fontsLoaded] = useFonts({
    NanumPenScript_400Regular,
  });
  
  const { isInitialized } = useAppStore();
  const { projects, setProjects } = useProjectStore();
  const { theme } = useTheme();
  const projectService = ProjectService.getInstance();
  const styles = createStyles(theme, fontsLoaded);

  useEffect(() => {
    if (isInitialized) {
      loadProjects();
    }
  }, [isInitialized]);

  const loadProjects = async () => {
    if (!isInitialized) {
      console.warn('Attempted to load projects before app initialization');
      return;
    }
    
    try {
      const projectList = await projectService.getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
      Alert.alert('Error', 'Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
  };

  const handleCreateProject = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/create-project');
  };

  const handleProjectPress = async (project: Project) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/project/${project.id}`);
  };

  const renderProject = ({ item: project }: { item: Project }) => (
    <DualToneProjectCard
      project={project}
      snippetCount={0} // TODO: Calculate from actual snippets
      totalDuration={0} // TODO: Calculate from actual snippets
      progress={Math.floor(Math.random() * 100)} // Mock progress for now
      onPress={handleProjectPress}
      style={styles.projectCard}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-open-outline" size={64} color={theme.colors.textTertiary} />
      <ThemedText variant="h2" style={styles.emptyTitle}>
        No Projects Yet
      </ThemedText>
      <ThemedText variant="body" color="secondary" style={styles.emptyMessage}>
        Create your first video journal project to get started capturing your daily moments.
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h2" style={styles.headerTitle}>Hello Paul</ThemedText>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Bento Stats Grid */}
      <BentoStatsGrid />

      {/* My Projects Section Header */}
      <View style={styles.sectionHeader}>
        <ThemedText variant="h2" style={styles.sectionTitle}>My Projects</ThemedText>
      </View>

      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any, fontsLoaded: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Pure white background
  },
  
  // Header - Clean and minimal with avatar
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space between text and avatar
    paddingHorizontal: theme.spacing.lg, // 24px generous spacing
    paddingVertical: theme.spacing.lg,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.mint, // Project's mint color
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2, // Creates the ring effect
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerTitle: {
    fontFamily: fontsLoaded ? 'NanumPenScript_400Regular' : 'System', // Nanum script font with fallback
    fontWeight: 'normal',
    fontSize: 45, // Increased from 20px for better visibility with Nanum font
    flex: 1, // Takes available space
  },
  headerTitle2: {
    fontFamily: fontsLoaded ? 'NanumPenScript_400Regular' : 'System', // Nanum script font with fallback
    fontWeight: 'normal',
    fontSize: 40, // Increased from 20px for better visibility with Nanum font
    flex: 1, // Takes available space
  },
  
  // Section Header for My Projects
  sectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl, // More space from BentoGrid
    paddingBottom: 0, // No space to FlatList
  },
  sectionTitle: {
    // fontFamily: 'Inter-SemiBold',
    // fontWeight: '600',
    fontFamily: fontsLoaded ? 'NanumPenScript_400Regular' : 'System', // Nanum script font with fallback
    fontWeight: 'normal',
    fontSize: 35,
  },
  
  // List with generous spacing
  listContainer: {
    paddingHorizontal: theme.spacing.lg, // Keep horizontal padding
    paddingTop: theme.spacing.sm, // Reduced top padding
    paddingBottom: 120, // Space for floating tab bar
  },
  
  // Project Card with reduced spacing
  projectCard: {
    marginBottom: theme.spacing.sm, // Reduced from lg (24px) to md (16px)
  },
  
  // Empty State - Centered and clean
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    lineHeight: 24,
  },
});