/**
 * CalendarGrid - Monthly calendar layout with design system styling
 * Implements Requirements 3.1, 3.2, 3.3, 3.4
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, BorderRadius, Animation, TouchTargets } from '../design-system';
import { CalendarCell } from './CalendarCell';
import { VideoSnippet } from '../types';

export interface CalendarGridProps {
  snippets: VideoSnippet[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onCellPress: (date: Date) => void;
  style?: any;
}

export function CalendarGrid({
  snippets,
  currentDate,
  onDateChange,
  onCellPress,
  style,
}: CalendarGridProps) {
  const [slideAnimation] = useState(new Animated.Value(0));
  const [isAnimating, setIsAnimating] = useState(false);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const screenWidth = Dimensions.get('window').width;
  const cellSize = (screenWidth - (Spacing.lg * 2) - (Spacing.xs * 6)) / 7; // Account for padding and gaps

  useEffect(() => {
    // Reset animation when date changes
    slideAnimation.setValue(0);
  }, [currentDate]);

  const generateCalendarDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks (42 days) to fill calendar grid
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getSnippetForDate = (date: Date): VideoSnippet | undefined => {
    const dateString = date.toISOString().split('T')[0];
    return snippets.find(s => s.calendarDate === dateString);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  };

  const animateTransition = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const toValue = direction === 'left' ? -screenWidth : screenWidth;
    
    Animated.sequence([
      Animated.timing(slideAnimation, {
        toValue,
        duration: Animation.duration.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  const navigateToPreviousMonth = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateTransition('right');
    
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    onDateChange(newDate);
  };

  const navigateToNextMonth = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateTransition('left');
    
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    onDateChange(newDate);
  };

  const handleCellPress = async (date: Date) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Add button press animation feedback
    const snippet = getSnippetForDate(date);
    if (snippet) {
      // Haptic feedback for video playback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    onCellPress(date);
  };

  const renderCalendarHeader = () => (
    <View style={styles.calendarHeader}>
      <TouchableOpacity 
        onPress={navigateToPreviousMonth} 
        style={styles.monthNavButton}
        disabled={isAnimating}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.sage} />
      </TouchableOpacity>
      
      <Text style={styles.monthTitle}>
        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </Text>
      
      <TouchableOpacity 
        onPress={navigateToNextMonth} 
        style={styles.monthNavButton}
        disabled={isAnimating}
      >
        <Ionicons name="chevron-forward" size={24} color={Colors.sage} />
      </TouchableOpacity>
    </View>
  );

  const renderWeekDaysHeader = () => (
    <View style={styles.weekDaysRow}>
      {weekDays.map((day) => (
        <View key={day} style={[styles.weekDayContainer, { width: cellSize }]}>
          <Text style={styles.weekDayText}>{day}</Text>
        </View>
      ))}
    </View>
  );

  const renderCalendarGrid = () => {
    const days = generateCalendarDays(currentDate);
    
    return (
      <Animated.View 
        style={[
          styles.calendarGridContainer,
          {
            transform: [{ translateX: slideAnimation }]
          }
        ]}
      >
        <View style={styles.calendarGrid}>
          {days.map((date, index) => {
            const snippet = getSnippetForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            
            return (
              <View key={index} style={[styles.cellContainer, { width: cellSize, height: cellSize }]}>
                <CalendarCell
                  date={date}
                  hasVideo={!!snippet}
                  thumbnailUri={snippet?.thumbnailPath}
                  isToday={isTodayDate}
                  onPress={handleCellPress}
                  style={[
                    styles.calendarCell,
                    !isCurrentMonthDay && styles.otherMonthCell,
                  ]}
                />
              </View>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  const renderProgressStats = () => {
    const currentMonthDays = generateCalendarDays(currentDate)
      .filter(date => isCurrentMonth(date));
    
    const filledDays = currentMonthDays.filter(date => {
      const snippet = getSnippetForDate(date);
      return !!snippet;
    });

    const progressPercentage = currentMonthDays.length > 0 
      ? (filledDays.length / currentMonthDays.length) * 100 
      : 0;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Monthly Progress</Text>
          <Text style={styles.progressStats}>
            {filledDays.length} / {currentMonthDays.length} days
          </Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderCalendarHeader()}
      {renderWeekDaysHeader()}
      {renderCalendarGrid()}
      {renderProgressStats()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  
  // Calendar Header
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  monthNavButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  monthTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  
  // Week Days Header
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  weekDayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Calendar Grid
  calendarGridContainer: {
    paddingHorizontal: Spacing.lg,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cellContainer: {
    marginBottom: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCell: {
    width: '90%', // Slightly smaller than container for spacing
    height: '90%',
  },
  otherMonthCell: {
    opacity: 0.3,
  },
  
  // Progress Stats
  progressContainer: {
    backgroundColor: Colors.offWhite,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  progressStats: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.sage,
    borderRadius: BorderRadius.xs,
  },
  progressPercentage: {
    ...Typography.body,
    color: Colors.sage,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
});