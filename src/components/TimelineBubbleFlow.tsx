/**
 * TimelineBubbleFlow - High-contrast timeline with bubble flow design
 * 
 * Features:
 * - Captured days: 70px circular video thumbnail with 4px mint border
 * - Empty days: 70px circle with black outline and centered date
 * - Generous 24px spacing between elements
 * - Horizontal or vertical flow layouts
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../design-system';
import { VideoSnippet } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface TimelineDay {
  date: Date;
  snippet?: VideoSnippet;
  dayNumber: number;
}

export interface TimelineBubbleFlowProps {
  days: TimelineDay[];
  onDayPress?: (day: TimelineDay) => void;
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export function TimelineBubbleFlow({
  days,
  onDayPress,
  orientation = 'horizontal',
  style
}: TimelineBubbleFlowProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme, orientation);

  const renderTimelineBubble = (day: TimelineDay, index: number) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
      scale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 300,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });
    };

    const handlePress = () => {
      if (onDayPress) {
        onDayPress(day);
      }
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    if (day.snippet) {
      // Captured day with video thumbnail
      return (
        <AnimatedPressable
          key={`day-${index}`}
          style={[styles.bubbleContainer, animatedStyle]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
        >
          <View style={styles.capturedBubble}>
            <Image
              source={{ uri: day.snippet.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </View>
        </AnimatedPressable>
      );
    } else {
      // Empty day with date number
      return (
        <AnimatedPressable
          key={`day-${index}`}
          style={[styles.bubbleContainer, animatedStyle]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
        >
          <View style={styles.emptyBubble}>
            <Text style={styles.dayNumber}>{day.dayNumber}</Text>
          </View>
        </AnimatedPressable>
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
      horizontal={orientation === 'horizontal'}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {days.map(renderTimelineBubble)}
    </ScrollView>
  );
}

const createStyles = (theme: any, orientation: 'horizontal' | 'vertical') => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    padding: theme.spacing.lg, // 24px generous spacing
  },
  bubbleContainer: {
    marginRight: orientation === 'horizontal' ? theme.spacing.lg : 0,
    marginBottom: orientation === 'vertical' ? theme.spacing.lg : 0,
  },
  capturedBubble: {
    width: theme.touchTargets.timeline, // 70px
    height: theme.touchTargets.timeline, // 70px
    borderRadius: theme.touchTargets.timeline / 2, // Perfect circle
    borderWidth: 4,
    borderColor: theme.colors.mint, // 4px solid mint border
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  emptyBubble: {
    width: theme.touchTargets.timeline, // 70px
    height: theme.touchTargets.timeline, // 70px
    borderRadius: theme.touchTargets.timeline / 2, // Perfect circle
    borderWidth: 1,
    borderColor: theme.colors.borderStrong, // 1px black outline
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    ...theme.typography.body,
    color: theme.colors.textTertiary, // Light gray
    fontWeight: '600',
  },
});

// Helper component for creating timeline data
export function createTimelineData(
  startDate: Date,
  endDate: Date,
  snippets: VideoSnippet[]
): TimelineDay[] {
  const days: TimelineDay[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const daySnippet = snippets.find(snippet => 
      isSameDay(new Date(snippet.createdAt), current)
    );
    
    days.push({
      date: new Date(current),
      snippet: daySnippet,
      dayNumber: current.getDate(),
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}