/**
 * ProjectDetail - Project detail screen with calendar/list views using design tokens
 * Implements Requirements 3.1
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ProjectsStackParamList } from '../navigation/types';
import { Colors, Spacing, Typography, TouchTargets, BorderRadius } from '../design-system';
import { MineButton, CalendarGrid, VideoPlayer } from '../components';
import { ProjectService } from '../services/ProjectService';
import { SnippetService } from '../services/SnippetService';
import { Project, VideoSnippet } from '../types';

type Props = StackScreenProps<ProjectsStackParamList, 'ProjectDetail'>;

type ViewMode = 'calendar' | 'list';

export function ProjectDetail({ navigation, route }: Props) {
  const { projectId } = route.params;
  
  const [project, setProject] = useState<Project | null>(null);
  const [snippets, setSnippets] = useState<VideoSnippet[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSnippet, setSelectedSnippet] = useState<VideoSnippet | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const projectService = ProjectService.getInstance();
  const snippetService = SnippetService.getInstance();

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const [projectData, snippetData] = await Promise.all([
        projectService.getProject(projectId),
        snippetService.getSnippetsForProject(projectId),
      ]);
      
      setProject(projectData);
      setSnippets(snippetData);
    } catch (error) {
      console.error('Failed to load project data:', error);
      Alert.alert('Error', 'Failed to load project data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewModeChange = async (mode: ViewMode) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(mode);
  };

  const handleCalendarCellPress = async (date: Date) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const dateString = date.toISOString().split('T')[0];
    const existingSnippet = snippets.find(s => s.calendarDate === dateString);
    
    if (existingSnippet) {
      // Play existing video with enhanced feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedSnippet(existingSnippet);
      setShowVideoPlayer(true);
    } else {
      // Navigate to camera for this date with smooth transition
      navigation.getParent()?.navigate('CaptureStack', {
        screen: 'CameraView',
        params: { projectId, targetDate: dateString }
      });
    }
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setSelectedSnippet(null);
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const renderProjectStats = () => {
    const totalVideos = snippets.length;
    const totalDuration = snippets.reduce((sum, snippet) => sum + snippet.duration, 0);
    
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="videocam" size={20} color={Colors.sage} />
          <Text style={styles.statValue}>{totalVideos}</Text>
          <Text style={styles.statLabel}>Videos</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Ionicons name="time" size={20} color={Colors.sage} />
          <Text style={styles.statValue}>{Math.round(totalDuration)}s</Text>
          <Text style={styles.statLabel}>Total Duration</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Ionicons name="calendar" size={20} color={Colors.sage} />
          <Text style={styles.statValue}>
            {project?.type === 'timeline' ? '30' : totalVideos}
          </Text>
          <Text style={styles.statLabel}>
            {project?.type === 'timeline' ? 'Days Goal' : 'Clips'}
          </Text>
        </View>
      </View>
    );
  };

  if (loading || !project) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.projectTitle}>{project.name}</Text>
          <Text style={styles.projectType}>
            {project.type === 'timeline' ? 'Timeline Project' : 'Freestyle Project'}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Project Stats */}
        {renderProjectStats()}
        
        {/* View Mode Toggle */}
        {project.type === 'timeline' && (
          <View style={styles.viewModeToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === 'calendar' && styles.toggleButtonActive
              ]}
              onPress={() => handleViewModeChange('calendar')}
            >
              <Ionicons 
                name="calendar" 
                size={16} 
                color={viewMode === 'calendar' ? Colors.white : Colors.sage} 
              />
              <Text style={[
                styles.toggleText,
                viewMode === 'calendar' && styles.toggleTextActive
              ]}>
                Calendar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === 'list' && styles.toggleButtonActive
              ]}
              onPress={() => handleViewModeChange('list')}
            >
              <Ionicons 
                name="list" 
                size={16} 
                color={viewMode === 'list' ? Colors.white : Colors.sage} 
              />
              <Text style={[
                styles.toggleText,
                viewMode === 'list' && styles.toggleTextActive
              ]}>
                List
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Calendar View */}
        {project.type === 'timeline' && viewMode === 'calendar' && (
          <CalendarGrid
            snippets={snippets}
            currentDate={currentDate}
            onDateChange={handleDateChange}
            onCellPress={handleCalendarCellPress}
            style={styles.calendarGrid}
          />
        )}
        
        {/* Empty State */}
        {snippets.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-outline" size={64} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>No Videos Yet</Text>
            <Text style={styles.emptyMessage}>
              Start capturing your daily moments to build your {project.type} project.
            </Text>
            <MineButton
              onPress={() => navigation.getParent()?.navigate('CaptureStack')}
              style={styles.emptyButton}
            >
              Capture First Video
            </MineButton>
          </View>
        )}
      </ScrollView>
      
      {/* Video Player Modal */}
      {selectedSnippet && (
        <VideoPlayer
          snippet={selectedSnippet}
          visible={showVideoPlayer}
          onClose={handleCloseVideoPlayer}
          autoPlay={true}
          showControls={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  projectTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  projectType: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Content
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.offWhite,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  
  // View Mode Toggle
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.offWhite,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  toggleButtonActive: {
    backgroundColor: Colors.sage,
  },
  toggleText: {
    ...Typography.body,
    color: Colors.sage,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: Colors.white,
  },
  
  // Calendar Grid
  calendarGrid: {
    marginTop: Spacing.lg,
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
});