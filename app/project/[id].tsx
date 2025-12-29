/**
 * ProjectDetail - Individual project screen with calendar and video management
 * Implements Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';

import { Colors, Spacing, Typography, TouchTargets, ZIndex } from '@/src/design-system';
import { CalendarGrid, VideoPlayer } from '@/src/components';
import { ProjectService } from '@/src/services/ProjectService';
import { SnippetService } from '@/src/services/SnippetService';
import { TimelineService } from '@/src/services/TimelineService';
import { Project, VideoSnippet } from '@/src/types';

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [snippets, setSnippets] = useState<VideoSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoSnippet | null>(null);
  const [hasNextVideo, setHasNextVideo] = useState(false);
  const [hasPreviousVideo, setHasPreviousVideo] = useState(false);

  const projectService = ProjectService.getInstance();
  const snippetService = SnippetService.getInstance();
  const timelineService = TimelineService.getInstance();

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      const [projectData, projectSnippets] = await Promise.all([
        projectService.getProject(id!),
        snippetService.getSnippetsForProject(id!)
      ]);

      if (!projectData) {
        Alert.alert('Error', 'Project not found');
        router.back();
        return;
      }

      setProject(projectData);
      setSnippets(projectSnippets);
    } catch (error) {
      console.error('Failed to load project data:', error);
      Alert.alert('Error', 'Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleDatePress = async (date: Date) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const dateString = date.toISOString().split('T')[0];
    const existingSnippet = snippets.find(s => s.calendarDate === dateString);
    
    if (existingSnippet) {
      // Find and play the video for this date
      await setSelectedVideoWithSequence(existingSnippet);
    } else {
      // Navigate to camera for this date
      router.push(`/camera?projectId=${id}&date=${dateString}`);
    }
  };

  const setSelectedVideoWithSequence = async (snippet: VideoSnippet) => {
    try {
      const sequence = await timelineService.getVideoSequence(id!, snippet.id);
      setSelectedVideo(snippet);
      setHasNextVideo(sequence.hasNext);
      setHasPreviousVideo(sequence.hasPrevious);
      setShowVideoPlayer(true);
    } catch (error) {
      console.error('Failed to load video sequence:', error);
      // Fallback to single video playback
      setSelectedVideo(snippet);
      setHasNextVideo(false);
      setHasPreviousVideo(false);
      setShowVideoPlayer(true);
    }
  };

  const handleNextVideo = async () => {
    if (!selectedVideo) return;
    
    try {
      const nextSnippet = await timelineService.getNextVideo(id!, selectedVideo.id);
      if (nextSnippet) {
        await setSelectedVideoWithSequence(nextSnippet);
      }
    } catch (error) {
      console.error('Failed to load next video:', error);
    }
  };

  const handlePreviousVideo = async () => {
    if (!selectedVideo) return;
    
    try {
      const previousSnippet = await timelineService.getPreviousVideo(id!, selectedVideo.id);
      if (previousSnippet) {
        await setSelectedVideoWithSequence(previousSnippet);
      }
    } catch (error) {
      console.error('Failed to load previous video:', error);
    }
  };

  const handleVideoPlayerClose = () => {
    setShowVideoPlayer(false);
    setSelectedVideo(null);
    setHasNextVideo(false);
    setHasPreviousVideo(false);
  };

  const getProjectTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    return type === 'timeline' ? 'calendar' : 'albums';
  };

  const getProjectTypeColor = (type: string): string => {
    return type === 'timeline' ? Colors.sage : Colors.lavender;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading project...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Project not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{project.name}</Text>
          <View style={styles.projectTypeBadge}>
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
        
        <TouchableOpacity
          onPress={() => Alert.alert('Settings', 'Project settings coming soon')}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <CalendarGrid
          snippets={snippets}
          currentDate={new Date()}
          onDateChange={() => {}} // Add empty handler for now
          onCellPress={handleDatePress}
        />
      </View>

      {/* Video Player Modal */}
      {showVideoPlayer && selectedVideo && (
        <VideoPlayer
          snippet={selectedVideo}
          visible={showVideoPlayer}
          onClose={handleVideoPlayerClose}
          autoPlay={true}
          showControls={true}
          showNoteOverlay={!!selectedVideo.note}
          autoPlayNext={project?.type === 'timeline'}
          hasNextVideo={hasNextVideo}
          hasPreviousVideo={hasPreviousVideo}
          onNextVideo={handleNextVideo}
          onPreviousVideo={handlePreviousVideo}
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
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
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  projectTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    backgroundColor: Colors.sage,
    gap: Spacing.xs,
  },
  projectTypeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  settingsButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  
  // Calendar
  calendarContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
  },
});