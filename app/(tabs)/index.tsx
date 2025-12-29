import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { Colors, Spacing, Typography, TouchTargets, ZIndex } from '@/src/design-system';
import { MineButton, MineCard } from '@/src/components';
import { ProjectService } from '@/src/services/ProjectService';
import { Project } from '@/src/types';
import { useAppStore } from '@/src/store';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
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
      onPress={() => handleProjectPress(project)}
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
          
          <View style={styles.projectMeta}>
            <Text style={styles.projectMetaText}>
              Created {formatDate(project.createdAt)}
            </Text>
            <Text style={styles.projectMetaText}>•</Text>
            <Text style={styles.projectMetaText}>
              Updated {formatDate(project.updatedAt)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.projectStats}>
        <View style={styles.statItem}>
          <Ionicons name="videocam" size={16} color={Colors.sage} />
          <Text style={styles.statText}>0 videos</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={16} color={Colors.textSecondary} />
          <Text style={styles.statText}>0s total</Text>
        </View>
      </View>
    </MineCard>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-open-outline" size={64} color={Colors.disabled} />
      <Text style={styles.emptyTitle}>No Projects Yet</Text>
      <Text style={styles.emptyMessage}>
        Create your first video journal project to get started capturing your daily moments.
      </Text>
      <MineButton
        onPress={handleCreateProject}
        style={styles.emptyButton}
      >
        Create First Project
      </MineButton>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Projects</Text>
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

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateProject}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  
  // Header
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  
  // List
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: 100, // Space for FAB
  },
  
  // Project Card
  projectCard: {
    marginBottom: Spacing.lg,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  projectMetaText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  
  // Project Stats
  projectStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  emptyMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  emptyButton: {
    marginTop: Spacing.md,
  },
  
  // FAB
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: TouchTargets.fab,
    height: TouchTargets.fab,
    borderRadius: TouchTargets.fab / 2,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
    zIndex: ZIndex.fab,
  },
});