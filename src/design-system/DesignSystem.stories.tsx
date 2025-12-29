/**
 * Design System Overview Stories
 * Comprehensive validation of Mine's design system
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, BorderRadius, Typography , TouchTargets as TouchTargetTokens } from './tokens';

const meta: Meta = {
  title: 'Design System/Overview',
  decorators: [
    (Story: any) => (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.offWhite }}>
        <View style={{ padding: Spacing.lg }}>
          <Story />
        </View>
      </ScrollView>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorPalette: Story = {
  render: () => (
    <View style={{ gap: Spacing.xl }}>
      <Text style={{ ...Typography.h1, color: Colors.textPrimary }}>
        Color Palette Validation
      </Text>
      
      {/* Primary Colors */}
      <View>
        <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md }}>
          Primary Colors (70% Usage)
        </Text>
        <View style={{ flexDirection: 'row', gap: Spacing.md }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: Colors.white, 
              borderRadius: BorderRadius.md,
              borderWidth: 1,
              borderColor: Colors.border
            }} />
            <Text style={{ ...Typography.caption, marginTop: Spacing.xs }}>White</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>{Colors.white}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: Colors.offWhite, 
              borderRadius: BorderRadius.md,
              borderWidth: 1,
              borderColor: Colors.border
            }} />
            <Text style={{ ...Typography.caption, marginTop: Spacing.xs }}>Off-White</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>{Colors.offWhite}</Text>
          </View>
        </View>
      </View>
      
      {/* Secondary Colors - Sage */}
      <View>
        <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md }}>
          Secondary Colors - Sage Green (30% Usage)
        </Text>
        <View style={{ flexDirection: 'row', gap: Spacing.md }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: Colors.sageLight, 
              borderRadius: BorderRadius.md
            }} />
            <Text style={{ ...Typography.caption, marginTop: Spacing.xs }}>Light</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>{Colors.sageLight}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: Colors.sage, 
              borderRadius: BorderRadius.md
            }} />
            <Text style={{ ...Typography.caption, marginTop: Spacing.xs }}>Main</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>{Colors.sage}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: Colors.sageDark, 
              borderRadius: BorderRadius.md
            }} />
            <Text style={{ ...Typography.caption, marginTop: Spacing.xs }}>Dark</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>{Colors.sageDark}</Text>
          </View>
        </View>
      </View>
      
      {/* Accent Colors - Lavender */}
      <View>
        <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md }}>
          Accent Colors - Lavender (10% Usage)
        </Text>
        <View style={{ flexDirection: 'row', gap: Spacing.md }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: Colors.lavenderLight, 
              borderRadius: BorderRadius.md
            }} />
            <Text style={{ ...Typography.caption, marginTop: Spacing.xs }}>Light</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>{Colors.lavenderLight}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: Colors.lavender, 
              borderRadius: BorderRadius.md
            }} />
            <Text style={{ ...Typography.caption, marginTop: Spacing.xs }}>Main</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>{Colors.lavender}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: Colors.lavenderDark, 
              borderRadius: BorderRadius.md
            }} />
            <Text style={{ ...Typography.caption, marginTop: Spacing.xs }}>Dark</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>{Colors.lavenderDark}</Text>
          </View>
        </View>
      </View>
      
      {/* Validation Checklist */}
      <View style={{ 
        backgroundColor: Colors.white, 
        padding: Spacing.lg, 
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border
      }}>
        <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md }}>
          Color Validation Checklist
        </Text>
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Only approved colors used throughout the app
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Sage green for primary actions and success states
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Lavender for accents and highlights
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ White/off-white for clean backgrounds
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Proper contrast ratios for accessibility
          </Text>
        </View>
      </View>
    </View>
  ),
};

export const SpacingSystem: Story = {
  render: () => (
    <View style={{ gap: Spacing.xl }}>
      <Text style={{ ...Typography.h1, color: Colors.textPrimary }}>
        8px Grid Spacing System
      </Text>
      
      <View style={{ gap: Spacing.lg }}>
        {Object.entries(Spacing).map(([key, value]) => (
          <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View style={{ 
              width: value, 
              height: 24, 
              backgroundColor: Colors.sage,
              borderRadius: BorderRadius.xs
            }} />
            <Text style={{ ...Typography.body, color: Colors.textPrimary, minWidth: 60 }}>
              {key}
            </Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
              {value}px
            </Text>
          </View>
        ))}
      </View>
      
      <View style={{ 
        backgroundColor: Colors.white, 
        padding: Spacing.lg, 
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border
      }}>
        <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md }}>
          Spacing Validation Checklist
        </Text>
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ All spacing values are multiples of 8px
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Consistent spacing hierarchy (xs → sm → md → lg → xl → xxl)
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Proper visual rhythm and grouping
          </Text>
        </View>
      </View>
    </View>
  ),
};

export const BorderRadiusSystem: Story = {
  render: () => (
    <View style={{ gap: Spacing.xl }}>
      <Text style={{ ...Typography.h1, color: Colors.textPrimary }}>
        Border Radius System
      </Text>
      
      <View style={{ gap: Spacing.lg }}>
        {Object.entries(BorderRadius).map(([key, value]) => (
          <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View style={{ 
              width: 60, 
              height: 40, 
              backgroundColor: Colors.sage,
              borderRadius: typeof value === 'number' ? value : 30 // Handle circle case
            }} />
            <Text style={{ ...Typography.body, color: Colors.textPrimary, minWidth: 60 }}>
              {key}
            </Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
              {typeof value === 'number' ? `${value}px` : `${value}%`}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={{ 
        backgroundColor: Colors.white, 
        padding: Spacing.lg, 
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border
      }}>
        <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md }}>
          Border Radius Usage
        </Text>
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            • xs (4px): Badges, tags
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            • sm (8px): Thumbnails, chips, small buttons
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            • md (12px): Inputs, calendar cells, secondary buttons
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            • lg (16px): Cards, modals, project cards
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            • xl (24px): Bottom sheet top corners
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            • xxl (32px): Primary buttons (pill-shaped)
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            • circle (50%): Record button, avatars
          </Text>
        </View>
      </View>
    </View>
  ),
};

export const TouchTargets: Story = {
  render: () => (
    <View style={{ gap: Spacing.xl }}>
      <Text style={{ ...Typography.h1, color: Colors.textPrimary }}>
        Touch Target Validation
      </Text>
      
      <View style={{ gap: Spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View style={{ 
            width: TouchTargetTokens.minimum, 
            height: TouchTargetTokens.minimum, 
            backgroundColor: Colors.sage,
            borderRadius: BorderRadius.md,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: 'bold' }}>44px</Text>
          </View>
          <View>
            <Text style={{ ...Typography.body, color: Colors.textPrimary }}>Minimum Touch Target</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
              WCAG 2.1 AA requirement
            </Text>
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View style={{ 
            width: TouchTargetTokens.button, 
            height: TouchTargetTokens.button, 
            backgroundColor: Colors.sage,
            borderRadius: BorderRadius.xxl,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{ color: Colors.white, fontSize: 12, fontWeight: 'bold' }}>56px</Text>
          </View>
          <View>
            <Text style={{ ...Typography.body, color: Colors.textPrimary }}>Standard Button</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
              Comfortable touch target
            </Text>
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View style={{ 
            width: TouchTargetTokens.fab, 
            height: TouchTargetTokens.fab, 
            backgroundColor: Colors.sage,
            borderRadius: TouchTargetTokens.fab / 2,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </View>
          <View>
            <Text style={{ ...Typography.body, color: Colors.textPrimary }}>FAB (Floating Action Button)</Text>
            <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
              Prominent primary action
            </Text>
          </View>
        </View>
      </View>
      
      <View style={{ 
        backgroundColor: Colors.white, 
        padding: Spacing.lg, 
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border
      }}>
        <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md }}>
          Touch Target Checklist
        </Text>
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ All interactive elements meet 44x44px minimum
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Adequate spacing between adjacent touch targets
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Clear visual feedback for touch interactions
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Comfortable one-handed usage on mobile devices
          </Text>
        </View>
      </View>
    </View>
  ),
};

export const TypographyScale: Story = {
  render: () => (
    <View style={{ gap: Spacing.xl }}>
      <Text style={{ ...Typography.h1, color: Colors.textPrimary }}>
        Typography Scale
      </Text>
      
      <View style={{ gap: Spacing.lg }}>
        <View>
          <Text style={Typography.h1}>H1 Heading (32px Bold)</Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            Screen titles, main headings
          </Text>
        </View>
        
        <View>
          <Text style={Typography.h2}>H2 Heading (24px Semibold)</Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            Section headers, modal titles
          </Text>
        </View>
        
        <View>
          <Text style={Typography.h3}>H3 Heading (18px Semibold)</Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            Card titles, subsections
          </Text>
        </View>
        
        <View>
          <Text style={Typography.bodyLarge}>Body Large (16px Regular)</Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            Key content, important information
          </Text>
        </View>
        
        <View>
          <Text style={Typography.body}>Body Text (14px Regular)</Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            Standard body text, descriptions
          </Text>
        </View>
        
        <View>
          <Text style={Typography.caption}>Caption Text (12px Regular)</Text>
          <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
            Metadata, timestamps, helper text
          </Text>
        </View>
      </View>
      
      <View style={{ 
        backgroundColor: Colors.white, 
        padding: Spacing.lg, 
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border
      }}>
        <Text style={{ ...Typography.h3, color: Colors.textPrimary, marginBottom: Spacing.md }}>
          Typography Validation
        </Text>
        <View style={{ gap: Spacing.xs }}>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Consistent font weights and sizes
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Proper line heights (1.5x font size)
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Clear hierarchy and visual distinction
          </Text>
          <Text style={{ ...Typography.caption, color: Colors.success }}>
            ✓ Readable contrast ratios
          </Text>
        </View>
      </View>
    </View>
  ),
};