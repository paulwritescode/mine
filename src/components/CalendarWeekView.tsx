/**
 * CalendarWeekView - Week view for calendar with horizontal scrolling
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, Typography, BorderRadius, TouchTargets } from '../design-system';
import { CalendarCell } from './CalendarCell';
import { VideoSnippet } from '../types';

export interface CalendarWeekViewProps {
  snippets: VideoSnippet[];
  currentDate: Date;
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  onCellPress: (date: Date) => void;
  style?: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_WIDTH = (SCREEN_WIDTH - (Spacing.lg * 2) - (Spacing.sm * 6)) / 7;
const CELL_HEIGHT = CELL_WIDTH;

export function CalendarWeekView({
  snippets,
  currentDate,
  selectedDate,
  onDateChange,
  onCellPress,
  style,
}: CalendarWeekViewProps) {
  const [weekStartDate, setWeekStartDate] = useState<Date>(getWeekStart(currentDate));
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setWeekStartDate(getWeekStart(currentDate));
  }, [currentDate]);

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  function getWeekDays(startDate: Date): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  }

  const getSnippetForDate = (date: Date): VideoSnippet | undefined => {
    const dateString = date.toISOString().split('T')[0];
    return snippets.find(s => s.calendarDate === dateString);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const navigateToPreviousWeek = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newWeekStart = new Date(weekStartDate);
    newWeekStart.setDate(weekStartDate.getDate() - 7);
    setWeekStartDate(newWeekStart);
    
    // Update current date to the same day of the previous week
    const newCurrentDate = new Date(currentDate);
    newCurrentDate.setDate(currentDate.getDate() - 7);
    onDateChange(newCurrentDate);

    // Animate transition
    Animated.sequence([
      Animated.timing(slideAnimation, {
        toValue: SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigateToNextWeek = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newWeekStart = new Date(weekStartDate);
    newWeekStart.setDate(weekStartDate.getDate() + 7);
    setWeekStartDate(newWeekStart);
    
    // Update current date to the same day of the next week
    const newCurrentDate = new Date(currentDate);
    newCurrentDate.setDate(currentDate.getDate() + 7);
    onDateChange(newCurrentDate);

    // Animate transition
    Animated.sequence([
      Animated.timing(slideAnimation, {
        toValue: -SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCellPress = async (date: Date) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCellPress(date);
  };

  const weekDays = getWeekDays(weekStartDate);
  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatWeekRange = (): string => {
    const today = new Date();
    const isCurrentWeek = weekDays.some(date => 
      date.toDateString() === today.toDateString()
    );
    
    if (isCurrentWeek) {
      return `Today, ${today.toLocaleDateString('en-US', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric' 
      })}`;
    }
    
    const endDate = new Date(weekStartDate);
    endDate.setDate(weekStartDate.getDate() + 6);
    
    const startMonth = weekStartDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const year = weekStartDate.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${weekStartDate.getDate()}-${endDate.getDate()}, ${year}`;
    } else {
      return `${startMonth} ${weekStartDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${year}`;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={navigateToPreviousWeek}
          style={styles.navButton}
        >
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.weekTitle}>{formatWeekRange()}</Text>
        
        <TouchableOpacity
          onPress={navigateToNextWeek}
          style={styles.navButton}
        >
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Week Days Header */}
      <View style={styles.weekDaysHeader}>
        {weekDayNames.map((dayName, index) => (
          <View key={dayName} style={styles.weekDayContainer}>
            <Text style={styles.weekDayText}>{dayName}</Text>
          </View>
        ))}
      </View>

      {/* Week Grid */}
      <Animated.View
        style={[
          styles.weekGrid,
          {
            transform: [{ translateX: slideAnimation }],
          },
        ]}
      >
        {weekDays.map((date, index) => {
          const snippet = getSnippetForDate(date);
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          
          return (
            <View key={index} style={styles.cellContainer}>
              <View style={[
                styles.dateContainer,
                isTodayDate && styles.todayDateContainer,
                isSelectedDate && styles.selectedDateContainer,
              ]}>
                <Text style={[
                  styles.weekDayName,
                  isTodayDate && styles.todayWeekDayName,
                ]}>
                  {weekDayNames[index]}
                </Text>
                <Text style={[
                  styles.dateText,
                  isTodayDate && styles.todayDateText,
                  isSelectedDate && styles.selectedDateText,
                ]}>
                  {date.getDate()}
                </Text>
              </View>
              
              {/* Video indicator or record button */}
              <View style={styles.videoIndicatorContainer}>
                <CalendarCell
                  date={date}
                  hasVideo={!!snippet}
                  thumbnailUri={snippet?.thumbnailPath}
                  isToday={false} // Don't apply today styling here, handled above
                  onPress={handleCellPress}
                  style={styles.calendarCell}
                />
              </View>
            </View>
          );
        })}
      </Animated.View>

      {/* Week Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statsContent}>
          <View style={styles.statItem}>
            <Ionicons name="videocam" size={16} color={Colors.sage} />
            <Text style={styles.statText}>
              {weekDays.filter(date => getSnippetForDate(date)).length} videos this week
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={16} color={Colors.textSecondary} />
            <Text style={styles.statText}>
              {Math.round((weekDays.filter(date => getSnippetForDate(date)).length / 7) * 100)}% complete
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  navButton: {
    width: TouchTargets.minimum,
    height: TouchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  navArrow: {
    fontSize: 32,
    color: Colors.black,
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
  },
  weekTitle: {
    ...Typography.h3,
    color: Colors.black,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
    fontSize: 18,
  },
  
  // Week Days Header
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  weekDayContainer: {
    width: CELL_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    ...Typography.caption,
    color: Colors.black,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  
  // Week Grid
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cellContainer: {
    width: CELL_WIDTH,
    alignItems: 'center',
  },
  dateContainer: {
    backgroundColor: Colors.white,
    borderRadius: 25, // Oval shape
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
    minWidth: CELL_WIDTH - 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDateContainer: {
    backgroundColor: Colors.black, // Black background for today
  },
  selectedDateContainer: {
    backgroundColor: Colors.black, // Black background for selected
  },
  weekDayName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginBottom: 2,
  },
  todayWeekDayName: {
    color: Colors.white,
  },
  dateText: {
    ...Typography.body,
    color: Colors.black,
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  todayDateText: {
    color: Colors.white, // White text on black background
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  selectedDateText: {
    color: Colors.white, // White text on black background
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  videoIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCell: {
    width: CELL_WIDTH - 8,
    height: CELL_WIDTH - 8,
  },
  
  // Stats (hidden for now)
  statsContainer: {
    display: 'none',
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});