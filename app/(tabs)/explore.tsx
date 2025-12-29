import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography } from '@/src/design-system';
import { MineButton, MineCard } from '@/src/components';
import { ProjectService } from '@/src/services/ProjectService';
import { Project } from '@/src/types';
import { useAppStore } from '@/src/store';

export default function CaptureScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isInitialized } = useAppStore();
  const projectService = ProjectService.getInstance();

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
    }
  };

  const handleCreateProject = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/create-project');
  };

  const handleProjectSelect = async (project: Project) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to camera with the selected project
    const today = new Date().toISOString().split('T')[0];
    router.push(`/camera?projectId=${project.id}&date=${today}`);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProjectTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    return type === 'timeline' ? 'calendar' : 'albums';
  };

  const getProjectTypeColor = (type: string): string => {
    return type === 'timeline' ? Colors.sage : Colors.lavender;
  };

  const renderProject = ({ item: project }: { item: Project }) => (
    <MineCard
      onPress={() => handleProjectSelect(project)}
      style={styles.projectCard}
    >
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <View style={styles.projectTitleRow}>
            <Text style={styles.projectName}>{project.name}</Text>
            <View style={[
              styles.projectTypeBadge,
              { backgroundColor: getProjectTypeColor(project.type) }
            ]}>
              <Ionicons 
                name={getProjectTypeIcon(project.type)} 
                size={12} 
                color={Colors.white} 
              />
              <Text style={styles.projectTypeText}>
                {project.type === 'timeline' ? 'Timeline' : 'Freestyle'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.projectMeta}>
            Created {formatDate(project.createdAt)}
          </Text>
        </View>
        
        <View style={styles.cameraIcon}>
          <Ionicons name="videocam" size={24} color={Colors.sage} />
        </View>
      </View>
    </MineCard>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="videocam-outline" size={80} color={Colors.sage} />
      </View>
      
      <Text style={styles.title}>Start Capturing</Text>
      <Text style={styles.subtitle}>
        Create your first project to start recording your daily video moments.
      </Text>
      
      <MineButton
        onPress={handleCreateProject}
        style={styles.createButton}
      >
        <Ionicons name="add" size={20} color={Colors.white} />
        <Text style={styles.buttonText}>Create Project</Text>
      </MineButton>
    </View>
  );

  const renderProjectList = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Project</Text>
        <Text style={styles.headerSubtitle}>
          Choose a project to start recording
        </Text>
      </View>

      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <MineButton
          onPress={handleCreateProject}
          style={styles.newProjectButton}
          variant="outline"
        >
          <Ionicons name="add" size={20} color={Colors.sage} />
          <Text style={styles.newProjectButtonText}>New Project</Text>
        </MineButton>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {projects.length === 0 ? renderEmptyState() : renderProjectList()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  
  // Header - removed separator
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    // Removed border separator
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  
  // List
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  
  // Project Card
  projectCard: {
    marginBottom: Spacing.lg,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectInfo: {
    flex: 1,
  },
  projectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  projectName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.md,
  },
  projectTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  projectTypeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  projectMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  cameraIcon: {
    padding: Spacing.sm,
  },
  
  // Footer
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  newProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  newProjectButtonText: {
    ...Typography.body,
    color: Colors.sage,
    fontWeight: '600',
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  buttonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
});