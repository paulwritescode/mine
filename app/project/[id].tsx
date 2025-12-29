/**
 * ProjectDetail - Individual project screen with calendar and video management
 * Implements Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';

import { Colors, Typography } from '@/src/design-system';
import { EnhancedCalendar, VideoPlayer, ProjectHeader } from '@/src/components';
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
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const handlePlayVideo = async (snippet: VideoSnippet) => {
    await setSelectedVideoWithSequence(snippet);
  };

  const handleRecordVideo = async (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    router.push(`/camera?projectId=${id}&date=${dateString}`);
  };

  const handleDeleteVideo = async (snippet: VideoSnippet) => {
    try {
      await snippetService.deleteSnippet(snippet.id);
      // Reload snippets after deletion
      await loadProjectData();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to delete video:', error);
      Alert.alert('Error', 'Failed to delete video. Please try again.');
    }
  };

  const handleRenameProject = async (project: Project) => {
    Alert.prompt(
      'Rename Project',
      'Enter a new name for your project:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Rename',
          onPress: async (newName?: string) => {
            if (newName && newName.trim()) {
              try {
                await projectService.updateProject(project.id, { name: newName.trim() });
                await loadProjectData();
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } catch (error) {
                console.error('Failed to rename project:', error);
                Alert.alert('Error', 'Failed to rename project. Please try again.');
              }
            }
          },
        },
      ],
      'plain-text',
      project.name
    );
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      await projectService.deleteProject(project.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Failed to delete project:', error);
      Alert.alert('Error', 'Failed to delete project. Please try again.');
    }
  };

  const handleShareProject = async (project: Project) => {
    Alert.alert(
      'Share Project',
      `Share "${project.name}" with others?\n\nThis will create a shareable link with all videos in this project.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: () => {
            // TODO: Implement actual sharing functionality
            Alert.alert('Coming Soon', 'Project sharing will be available in a future update.');
          },
        },
      ]
    );
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
      {/* Mint Background Container for Header and Calendar */}
      <View style={styles.mintContainer}>
        {/* Project Header */}
        <ProjectHeader
          project={project}
          onBack={() => router.back()}
          onRename={handleRenameProject}
          onDelete={handleDeleteProject}
          onShare={handleShareProject}
        />

        {/* Enhanced Calendar */}
        <View style={styles.calendarContainer}>
          <EnhancedCalendar
            snippets={snippets}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onPlayVideo={handlePlayVideo}
            onRecordVideo={handleRecordVideo}
            onDeleteVideo={handleDeleteVideo}
          />
        </View>
      </View>

      {/* White Background Container for Lower Half */}
      <View style={styles.whiteContainer}>
        {/* This space can be used for additional content in the future */}
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
    backgroundColor: Colors.white,
  },
  
  // Mint Background Container - Half Screen
  mintContainer: {
    flex: 0.5, // Half screen height
    backgroundColor: Colors.mint,
  },
  
  // White Background Container - Half Screen
  whiteContainer: {
    flex: 0.5, // Half screen height
    backgroundColor: Colors.white,
  },
  
  // Calendar
  calendarContainer: {
    flex: 1,
  },
  
  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
  },
});