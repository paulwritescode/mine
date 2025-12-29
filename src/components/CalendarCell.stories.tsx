/**
 * CalendarCell Storybook Stories
 * Design system validation and documentation
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View, Text } from 'react-native';

import { CalendarCell } from './CalendarCell';
import { Colors, Spacing, BorderRadius, Typography } from '../design-system';

const meta: Meta<typeof CalendarCell> = {
  title: 'Design System/CalendarCell',
  component: CalendarCell,
  argTypes: {
    hasVideo: {
      control: { type: 'boolean' },
    },
    isToday: {
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

const sampleDate = new Date(2025, 0, 15); // January 15, 2025

export const Empty: Story = {
  args: {
    date: sampleDate,
    hasVideo: false,
    isToday: false,
    onPress: (date: Date) => console.log('Empty cell pressed:', date),
  },
};

export const WithVideo: Story = {
  args: {
    date: sampleDate,
    hasVideo: true,
    thumbnailUri: 'https://via.placeholder.com/44x44/9CAF88/FFFFFF?text=15',
    isToday: false,
    onPress: (date: Date) => console.log('Video cell pressed:', date),
  },
};

export const Today: Story = {
  args: {
    date: new Date(), // Today's date
    hasVideo: false,
    isToday: true,
    onPress: (date: Date) => console.log('Today cell pressed:', date),
  },
};

export const TodayWithVideo: Story = {
  args: {
    date: new Date(), // Today's date
    hasVideo: true,
    thumbnailUri: 'https://via.placeholder.com/44x44/B8A4D5/FFFFFF?text=29',
    isToday: true,
    onPress: (date: Date) => console.log('Today with video pressed:', date),
  },
};

export const CalendarGrid: Story = {
  render: () => {
    const generateWeek = (startDate: Date) => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        days.push(date);
      }
      return days;
    };

    const weekStart = new Date(2025, 0, 26); // Start of a week
    const weekDays = generateWeek(weekStart);
    const today = new Date();

    return (
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.md }}>
          Calendar Grid Example
        </Text>
        
        {/* Week day headers */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.md }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={{ 
              fontSize: 12, 
              color: Colors.textSecondary, 
              fontWeight: '600',
              textAlign: 'center',
              width: 44
            }}>
              {day}
            </Text>
          ))}
        </View>
        
        {/* Calendar cells */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.lg }}>
          {weekDays.map((date, index) => (
            <CalendarCell
              key={index}
              date={date}
              hasVideo={index % 3 === 0} // Some cells have videos
              thumbnailUri={index % 3 === 0 ? `https://via.placeholder.com/44x44/9CAF88/FFFFFF?text=${date.getDate()}` : undefined}
              isToday={date.toDateString() === today.toDateString()}
              onPress={(date: Date) => console.log('Calendar cell pressed:', date)}
            />
          ))}
        </View>
      </View>
    );
  },
};

export const DesignValidation: Story = {
  render: () => (
    <View style={{ gap: Spacing.lg }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary }}>
        Design System Validation
      </Text>
      
      <View style={{ gap: Spacing.md }}>
        <Text style={{ ...Typography.body, color: Colors.textPrimary }}>
          Border Radius & Colors
        </Text>
        
        <View style={{ flexDirection: 'row', gap: Spacing.md, alignItems: 'center' }}>
          <CalendarCell
            date={new Date(2025, 0, 1)}
            hasVideo={false}
            isToday={false}
            onPress={() => {}}
          />
          <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
            ✓ 12px radius (BorderRadius.md)
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', gap: Spacing.md, alignItems: 'center' }}>
          <CalendarCell
            date={new Date(2025, 0, 2)}
            hasVideo={true}
            thumbnailUri="https://via.placeholder.com/44x44/9CAF88/FFFFFF?text=2"
            isToday={false}
            onPress={() => {}}
          />
          <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
            ✓ Sage border when filled
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', gap: Spacing.md, alignItems: 'center' }}>
          <CalendarCell
            date={new Date()}
            hasVideo={false}
            isToday={true}
            onPress={() => {}}
          />
          <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
            ✓ Lavender border for today
          </Text>
        </View>
      </View>
      
      <View style={{ gap: Spacing.md }}>
        <Text style={{ ...Typography.body, color: Colors.textPrimary }}>
          Touch Targets
        </Text>
        <Text style={{ fontSize: 12, color: Colors.success }}>
          ✓ All cells are 44x44px (meets minimum requirement)
        </Text>
        <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
          ✓ Adequate spacing between cells (2px margin)
        </Text>
      </View>
    </View>
  ),
};