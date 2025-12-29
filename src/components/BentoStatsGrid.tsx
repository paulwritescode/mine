/**
 * BentoStatsGrid - Bento-style grid layout for project statistics
 * 
 * Features:
 * - 5 stat cards in a bento grid layout
 * - Different background colors (black, lavender, cream)
 * - Responsive grid layout
 * - Clean minimal design
 * - Real project data integration
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useFonts, NanumPenScript_400Regular } from '@expo-google-fonts/nanum-pen-script';

import { useTheme } from '../design-system';
import { useProjectStore } from '../store/useProjectStore';
import { formatBigNumber } from '../utils';

export interface BentoStatsGridProps {
  style?: any;
}

export function BentoStatsGrid({ style }: BentoStatsGridProps) {
  const { theme } = useTheme();
  const { projects, snippets } = useProjectStore();
  
  // Load fonts locally to ensure they're available
  const [fontsLoaded] = useFonts({
    NanumPenScript_400Regular,
  });
  
  const styles = createStyles(theme, fontsLoaded);

  // Calculate stats
  const projectCount = projects.length;
  const snippetCount = snippets.length;
  // Calculate total videos by counting snippets per project
  const totalVideos = snippets.length; // Each snippet represents a video

  return (
    <View style={[styles.container, style]}>
      {/* Top Row - Large card on left, smaller on right */}
      <View style={styles.topRow}>
        {/* Large card - Total Projects */}
        <View style={[styles.card, styles.largeCard, styles.blackCard]}>
          <Text style={styles.bigStatNumberWhite}>{formatBigNumber(projectCount)}</Text>
          <Text style={styles.badgeTextWhite}>Total Projects</Text>
        </View>
        
        {/* Small card - Video Snippets */}
        <View style={[styles.card, styles.smallCard, styles.lavenderCard]}>
          <Text style={styles.bigStatNumber}>{formatBigNumber(snippetCount)}</Text>
          <Text style={styles.badgeTextNoBg}>Snippets</Text>
        </View>
      </View>

      {/* Bottom Row - Two cards */}
      <View style={styles.bottomRow}>
        {/* Medium card - Total Videos */}
        <View style={[styles.card, styles.mediumCard, styles.yellowCard]}>
          <Text style={styles.bigStatNumber}>{formatBigNumber(totalVideos)}</Text>
          <Text style={styles.badgeTextNoBg}>Total Videos</Text>
        </View>
        
        {/* Large card - Combined Coming Soon */}
        <View style={[styles.card, styles.largeBottomCard, styles.mint3Card]}>
          <Text style={styles.categoryText}>Storage & Analytics</Text>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any, fontsLoaded: boolean) => StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  
  // Row layouts - Reduced spacing
  topRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm, // Reduced from md
    height: 160,
  },
  bottomRow: {
    flexDirection: 'row',
    height: 140,
  },
  
  // Base card styles
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  
  // Card sizes - Top row - Reduced spacing
  largeCard: {
    flex: 2,
    marginRight: theme.spacing.sm, // Reduced from md
  },
  smallCard: {
    flex: 1,
  },
  
  // Card sizes - Bottom row - Reduced spacing
  mediumCard: {
    flex: 1,
    marginRight: theme.spacing.sm, // Reduced from md
  },
  largeBottomCard: {
    flex: 2,
    // No right margin for last card
  },
  smallBottomCard: {
    flex: 1,
    marginRight: theme.spacing.sm, // Reduced from md
  },
  smallBottomCardLast: {
    flex: 1,
    // No right margin for last card
  },
  
  // Background colors
  creamCard: {
    backgroundColor: '#D1EDC0', // Mint color from design system
  },
  lavenderCard: {
    backgroundColor: '#F4E5FB', // Lavender
  },
  yellowCard: {
    backgroundColor: '#F9ECD7', // Cream/yellow
  },
  grayCard: {
    backgroundColor: '#F5F5F5', // Light gray
  },
  pinkCard: {
    backgroundColor: '#FFE4E1', // Light pink
  },
  mint3Card: {
    backgroundColor: theme.colors.mint, // Project mint color
  },
  blackCard: {
    backgroundColor: theme.colors.black,
  },
  
  // Text styles
  statNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  // Big number style for visual impact with Nanum Pen Script
  bigStatNumber: {
    fontSize: 64,
    fontFamily: fontsLoaded ? 'NanumPenScript_400Regular' : 'System',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
    lineHeight: 68,
  },
  // Big number style for white text on black background
  bigStatNumberWhite: {
    fontSize: 64,
    fontFamily: fontsLoaded ? 'NanumPenScript_400Regular' : 'System',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
    lineHeight: 68,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.black,
    opacity: 0.7,
    marginBottom: theme.spacing.xs,
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  
  // Badge text without background
  badgeTextNoBg: {
    color: theme.colors.black,
    fontSize: 12,
    fontWeight: '600',
  },
  // Badge text for white on black
  badgeTextWhite: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Badge styles (keeping for potential future use)
  badge: {
    backgroundColor: theme.colors.black,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xl,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});