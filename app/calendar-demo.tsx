/**
 * Calendar Demo - Showcase the enhanced calendar functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography } from '@/src/design-system';
import { EnhancedCalendar } from '@/src/components';
import { VideoSnippet } from '@/src/types';

// Mock data for demonstration
const mockSnippets: VideoSnippet[] = [
  {
    id: 'demo_1',
    projectId: 'demo_project',
    filePath: '/demo/video1.mp4',
    thumbnailPath: 'https://picsum.photos/200/200?random=1',
    duration: 2.5,
    recordedDate: new Date('2024-12-25'),
    calendarDate: '2024-12-25',
    metadata: {},
    createdAt: new Date('2024-12-25'),
    note: 'Christmas morning with family! Opening presents and enjoying the holiday spirit.',
  },
  {
    id: 'demo_2',
    projectId: 'demo_project',
    filePath: '/demo/video2.mp4',
    thumbnailPath: 'https://picsum.photos/200/200?random=2',
    duration: 1.8,
    recordedDate: new Date('2024-12-28'),
    calendarDate: '2024-12-28',
    metadata: {},
    createdAt: new Date('2024-12-28'),
    note: 'Weekend hike in the mountains. Beautiful views and fresh air!',
  },
  {
    id: 'demo_3',
    projectId: 'demo_project',
    filePath: '/demo/video3.mp4',
    thumbnailPath: 'https://picsum.photos/200/200?random=3',
    duration: 3.2,
    recordedDate: new Date(),
    calendarDate: new Date().toISOString().split('T')[0],
    metadata: {},
    createdAt: new Date(),
    note: "Today's video - testing the enhanced calendar features!",
  },
];

export default function CalendarDemo() {
  const [snippets, setSnippets] = useState<VideoSnippet[]>(mockSnippets);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePlayVideo = async (snippet: VideoSnippet) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Play Video',
      `Playing video from ${snippet.recordedDate.toLocaleDateString()}\n\nDuration: ${snippet.duration}s\nNote: ${snippet.note || 'No note'}`,
      [{ text: 'OK' }]
    );
  };

  const handleRecordVideo = async (date: Date) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Record Video',
      `Would record a new video for ${date.toLocaleDateString()}.\n\nIn the real app, this would open the camera.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Record',
          onPress: () => {
            // Simulate adding a new video
            const newSnippet: VideoSnippet = {
              id: `demo_${Date.now()}`,
              projectId: 'demo_project',
              filePath: '/demo/new_video.mp4',
              thumbnailPath: `https://picsum.photos/200/200?random=${Date.now()}`,
              duration: 2.0,
              recordedDate: date,
              calendarDate: date.toISOString().split('T')[0],
              metadata: {},
              createdAt: new Date(),
              note: `New video recorded on ${date.toLocaleDateString()}`,
            };
            setSnippets(prev => [...prev, newSnippet]);
            Alert.alert('Success', 'Video recorded successfully!');
          },
        },
      ]
    );
  };

  const handleDeleteVideo = async (snippet: VideoSnippet) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Delete Video',
      `Delete video from ${snippet.recordedDate.toLocaleDateString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSnippets(prev => prev.filter(s => s.id !== snippet.id));
            Alert.alert('Deleted', 'Video deleted successfully!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enhanced Calendar Demo</Text>
        <Text style={styles.headerSubtitle}>
          Explore month/week views and interactive video management
        </Text>
      </View>

      {/* Enhanced Calendar */}
      <EnhancedCalendar
        snippets={snippets}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onPlayVideo={handlePlayVideo}
        onRecordVideo={handleRecordVideo}
        onDeleteVideo={handleDeleteVideo}
        style={styles.calendar}
      />

      {/* Instructions */}
      <View style={styles.instructions}>
        <View style={styles.instructionItem}>
          <Ionicons name="hand-left" size={16} color={Colors.sage} />
          <Text style={styles.instructionText}>
            Tap dates to open the full-width video drawer
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="swap-horizontal" size={16} color={Colors.sage} />
          <Text style={styles.instructionText}>
            Use the toggle button to switch between month and week views
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="analytics" size={16} color={Colors.sage} />
          <Text style={styles.instructionText}>
            Semicircle progress shows completion at the top
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="videocam" size={16} color={Colors.sage} />
          <Text style={styles.instructionText}>
            Record, play, or delete videos from the drawer
          </Text>
        </View>
      </View>
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
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  
  // Calendar
  calendar: {
    flex: 1,
  },
  
  // Instructions
  instructions: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  instructionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
});