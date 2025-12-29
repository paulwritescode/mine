/**
 * MineInput Storybook Stories
 * Design system validation and documentation
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View, Text } from 'react-native';

import { MineInput } from './MineInput';
import { Colors, Spacing, Typography } from '../design-system';

const meta: Meta<typeof MineInput> = {
  title: 'Design System/MineInput',
  component: MineInput,
  argTypes: {
    multiline: {
      control: { type: 'boolean' },
    },
  },
  decorators: [
    (Story: any) => (
      <View style={{ padding: Spacing.lg, backgroundColor: Colors.offWhite }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Project Name',
    placeholder: 'Enter project name...',
  },
};

export const WithError: Story = {
  args: {
    label: 'Project Name',
    placeholder: 'Enter project name...',
    error: 'Project name is required',
  },
};

export const Multiline: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Add your notes here...',
    multiline: true,
  },
};

export const FocusStates: Story = {
  render: () => (
    <View style={{ gap: Spacing.lg }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary }}>
        Focus State Validation
      </Text>
      
      <MineInput
        label="Normal State"
        placeholder="Click to focus and see sage border"
      />
      
      <MineInput
        label="Error State"
        placeholder="This field has an error"
        error="This field is required"
      />
      
      <View style={{ marginTop: Spacing.md }}>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Focus state shows sage border and glow
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Error state shows red border
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Placeholder uses disabled color for low contrast
        </Text>
      </View>
    </View>
  ),
};

export const TouchTargets: Story = {
  render: () => (
    <View style={{ gap: Spacing.lg }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary }}>
        Touch Target Validation
      </Text>
      
      <MineInput
        label="Standard Input (56px height)"
        placeholder="Meets 44px minimum requirement"
      />
      
      <MineInput
        label="Multiline Input (80px+ height)"
        placeholder="Exceeds minimum requirement"
        multiline
      />
      
      <View style={{ marginTop: Spacing.md }}>
        <Text style={{ ...Typography.caption, color: Colors.success }}>
          ✓ Standard input: 56px height (exceeds 44px minimum)
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.success }}>
          ✓ Multiline input: 80px+ height (exceeds minimum)
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Adequate padding for comfortable touch interaction
        </Text>
      </View>
    </View>
  ),
};

export const DesignValidation: Story = {
  render: () => (
    <View style={{ gap: Spacing.lg }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary }}>
        Design System Validation
      </Text>
      
      <MineInput
        label="Border Radius Test"
        placeholder="12px border radius (BorderRadius.md)"
      />
      
      <MineInput
        label="Color Validation"
        placeholder="Sage focus state, white background"
      />
      
      <View style={{ marginTop: Spacing.md }}>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Border radius: 12px (BorderRadius.md)
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Background: White (#FFFFFF)
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Border: Light gray (#E0E0E0) normal, sage (#9CAF88) focused
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Padding: 16px (Spacing.md) for comfortable text entry
        </Text>
        <Text style={{ ...Typography.caption, color: Colors.textSecondary }}>
          ✓ Typography: Body text (14px) with proper line height
        </Text>
      </View>
    </View>
  ),
};