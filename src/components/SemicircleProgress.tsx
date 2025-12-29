/**
 * SemicircleProgress - Simple semicircle progress indicator
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Colors, Spacing, Typography } from '../design-system';

export interface SemicircleProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  title?: string;
  subtitle?: string;
  style?: any;
}

export function SemicircleProgress({
  percentage,
  size = 160,
  strokeWidth = 12,
  title,
  subtitle,
  style,
}: SemicircleProgressProps) {
  return (
    <View style={[styles.container, { width: size, height: size / 2 + 60 }, style]}>
      {/* Background semicircle */}
      <View
        style={[
          styles.backgroundCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: Colors.border,
            borderBottomColor: 'transparent',
          },
        ]}
      />

      {/* Progress semicircle - rotated to start from left */}
      <View
        style={[
          styles.progressContainer,
          {
            width: size,
            height: size / 2,
          },
        ]}
      >
        <View
          style={[
            styles.progressCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: 'transparent',
              borderTopColor: Colors.sage,
              borderLeftColor: Colors.sage,
              borderRightColor: percentage > 50 ? Colors.sage : 'transparent',
              // Rotate to start from left side and fill based on percentage
              transform: [
                { rotate: `${-90 + (percentage * 1.8)}deg` }
              ],
            },
          ]}
        />
      </View>

      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    top: 0,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden', // This clips the bottom half
  },
  progressCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  centerContent: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    ...Typography.h1,
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 36,
    lineHeight: 40,
  },
  title: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
    fontSize: 16,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});