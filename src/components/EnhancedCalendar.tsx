/**
 * EnhancedCalendar - Calendar with month/week view toggle and drawer
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '../design-system';
import { CalendarGrid } from './CalendarGrid';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarDrawer } from './CalendarDrawer';
import { VideoSnippet } from '../types';

export interface EnhancedCalendarProps {
  snippets: VideoSnippet[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onPlayVideo: (snippet: VideoSnippet) => void;
  onRecordVideo: (date: Date) => void;
  onDeleteVideo: (snippet: VideoSnippet) => void;
  style?: any;
}

type ViewMode = 'month' | 'week';

export function EnhancedCalendar({
  snippets,
  currentDate,
  onDateChange,
  onPlayVideo,
  onRecordVideo,
  onDeleteVideo,
  style,
}: EnhancedCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<VideoSnippet | null>(null);

  const handleViewModeToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(viewMode === 'month' ? 'week' : 'month');
  };

  const handleCellPress = async (date: Date) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const dateString = date.toISOString().split('T')[0];
    const snippet = snippets.find(s => s.calendarDate === dateString);
    
    setSelectedDate(date);
    setSelectedSnippet(snippet || null);
    setShowDrawer(true);
  };

  const handleDrawerClose = () => {
    setShowDrawer(false);
    setSelectedDate(null);
    setSelectedSnippet(null);
  };

  const handlePlayVideo = (snippet: VideoSnippet) => {
    handleDrawerClose();
    onPlayVideo(snippet);
  };

  const handleRecordVideo = (date: Date) => {
    handleDrawerClose();
    onRecordVideo(date);
  };

  const handleDeleteVideo = (snippet: VideoSnippet) => {
    handleDrawerClose();
    onDeleteVideo(snippet);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getViewModeIcon = (): keyof typeof Ionicons.glyphMap => {
    return viewMode === 'month' ? 'calendar' : 'grid';
  };

  const getViewModeText = (): string => {
    return viewMode === 'month' ? 'Week View' : 'Month View';
  };

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  return (
    <View style={[styles.container, style]}>
      {/* View Toggle Header */}
      <View style={styles.toggleHeader}>
        <TouchableOpacity
          onPress={handleViewModeToggle}
          style={styles.toggleButton}
        >
          <Ionicons name={getViewModeIcon()} size={20} color={Colors.black} />
          <Text style={styles.toggleButtonText}>{getViewModeText()}</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Content */}
      <View style={styles.calendarContent}>
        {viewMode === 'month' ? (
          <CalendarGrid
            snippets={snippets}
            currentDate={currentDate}
            onDateChange={onDateChange}
            onCellPress={handleCellPress}
          />
        ) : (
          <CalendarWeekView
            snippets={snippets}
            currentDate={currentDate}
            selectedDate={selectedDate || undefined}
            onDateChange={onDateChange}
            onCellPress={handleCellPress}
          />
        )}
      </View>

      {/* Calendar Drawer */}
      <CalendarDrawer
        visible={showDrawer}
        selectedDate={selectedDate}
        snippet={selectedSnippet}
        isToday={selectedDate ? isToday(selectedDate) : false}
        onClose={handleDrawerClose}
        onPlayVideo={handlePlayVideo}
        onRecordVideo={handleRecordVideo}
        onDeleteVideo={handleDeleteVideo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  // Toggle Header
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: 'transparent',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    gap: Spacing.xs,
  },
  toggleButtonText: {
    ...Typography.caption,
    color: Colors.black,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
  
  // Calendar Content
  calendarContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
});