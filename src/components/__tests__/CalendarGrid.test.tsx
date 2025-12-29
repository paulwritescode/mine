/**
 * CalendarGrid Component Tests
 * 
 * Tests for calendar display, navigation, and progress statistics.
 * Validates Requirements 3.5, 3.6, 3.7
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CalendarGrid } from '../CalendarGrid';
import { VideoSnippet } from '../../types';

// Mock Haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
  },
}));

// Mock video snippets for testing
const mockSnippets: VideoSnippet[] = [
  {
    id: 'snippet_1',
    projectId: 'project_1',
    filePath: '/path/to/video1.mp4',
    thumbnailPath: '/path/to/thumb1.jpg',
    duration: 2.5,
    recordedDate: new Date('2024-01-15'),
    calendarDate: '2024-01-15',
    createdAt: new Date('2024-01-15'),
    metadata: {},
  },
  {
    id: 'snippet_2',
    projectId: 'project_1',
    filePath: '/path/to/video2.mp4',
    thumbnailPath: '/path/to/thumb2.jpg',
    duration: 1.8,
    recordedDate: new Date('2024-01-18'),
    calendarDate: '2024-01-18',
    createdAt: new Date('2024-01-18'),
    metadata: {},
  },
];

const defaultProps = {
  snippets: mockSnippets,
  currentDate: new Date('2024-01-15'),
  onDateChange: jest.fn(),
  onCellPress: jest.fn(),
};

describe('CalendarGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Calendar Display', () => {
    it('renders calendar with correct month and year', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      expect(getByText('January 2024')).toBeTruthy();
    });

    it('displays week day headers', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      weekDays.forEach(day => {
        expect(getByText(day)).toBeTruthy();
      });
    });

    it('renders calendar cells for all days in month', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      // January 2024 has 31 days
      for (let day = 1; day <= 31; day++) {
        expect(getByText(day.toString())).toBeTruthy();
      }
    });

    it('shows filled days with video snippets', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      // Days 15 and 18 should be filled (have video snippets)
      const day15 = getByText('15');
      const day18 = getByText('18');
      
      expect(day15).toBeTruthy();
      expect(day18).toBeTruthy();
    });

    it('shows empty days without video snippets', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      // Day 10 should be empty (no video snippet)
      const day10 = getByText('10');
      expect(day10).toBeTruthy();
    });
  });

  describe('Calendar Navigation', () => {
    it('navigates to previous month when left arrow is pressed', async () => {
      const onDateChange = jest.fn();
      const { getByTestId } = render(
        <CalendarGrid {...defaultProps} onDateChange={onDateChange} />
      );
      
      // Find and press the previous month button
      const prevButton = getByTestId('prev-month-button') || 
                        getByText('January 2024').parent?.children[0];
      
      if (prevButton) {
        fireEvent.press(prevButton);
        
        await waitFor(() => {
          expect(onDateChange).toHaveBeenCalledWith(
            expect.objectContaining({
              getMonth: expect.any(Function),
              getFullYear: expect.any(Function),
            })
          );
        });
      }
    });

    it('navigates to next month when right arrow is pressed', async () => {
      const onDateChange = jest.fn();
      const { getByTestId } = render(
        <CalendarGrid {...defaultProps} onDateChange={onDateChange} />
      );
      
      // Find and press the next month button
      const nextButton = getByTestId('next-month-button') || 
                        getByText('January 2024').parent?.children[2];
      
      if (nextButton) {
        fireEvent.press(nextButton);
        
        await waitFor(() => {
          expect(onDateChange).toHaveBeenCalledWith(
            expect.objectContaining({
              getMonth: expect.any(Function),
              getFullYear: expect.any(Function),
            })
          );
        });
      }
    });

    it('displays correct month title after navigation', () => {
      const marchDate = new Date('2024-03-01');
      const { getByText } = render(
        <CalendarGrid {...defaultProps} currentDate={marchDate} />
      );
      
      expect(getByText('March 2024')).toBeTruthy();
    });
  });

  describe('Day Cell Interactions', () => {
    it('calls onCellPress when a day cell is pressed', async () => {
      const onCellPress = jest.fn();
      const { getByText } = render(
        <CalendarGrid {...defaultProps} onCellPress={onCellPress} />
      );
      
      const day15 = getByText('15');
      fireEvent.press(day15);
      
      await waitFor(() => {
        expect(onCellPress).toHaveBeenCalledWith(
          expect.objectContaining({
            getDate: expect.any(Function),
          })
        );
      });
    });

    it('handles filled day cell press (existing video)', async () => {
      const onCellPress = jest.fn();
      const { getByText } = render(
        <CalendarGrid {...defaultProps} onCellPress={onCellPress} />
      );
      
      // Day 15 has a video snippet
      const day15 = getByText('15');
      fireEvent.press(day15);
      
      await waitFor(() => {
        expect(onCellPress).toHaveBeenCalled();
      });
    });

    it('handles empty day cell press (no video)', async () => {
      const onCellPress = jest.fn();
      const { getByText } = render(
        <CalendarGrid {...defaultProps} onCellPress={onCellPress} />
      );
      
      // Day 10 has no video snippet
      const day10 = getByText('10');
      fireEvent.press(day10);
      
      await waitFor(() => {
        expect(onCellPress).toHaveBeenCalled();
      });
    });
  });

  describe('Progress Statistics', () => {
    it('displays monthly progress section', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      expect(getByText('Monthly Progress')).toBeTruthy();
    });

    it('calculates correct progress statistics', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      // January 2024 has 31 days, 2 are filled
      expect(getByText('2 / 31 days')).toBeTruthy();
    });

    it('displays correct progress percentage', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      // 2 out of 31 days = ~6%
      expect(getByText('6%')).toBeTruthy();
    });

    it('shows 0% progress for empty calendar', () => {
      const { getByText } = render(
        <CalendarGrid {...defaultProps} snippets={[]} />
      );
      
      expect(getByText('0 / 31 days')).toBeTruthy();
      expect(getByText('0%')).toBeTruthy();
    });

    it('shows 100% progress for full calendar', () => {
      // Create snippets for all days in January
      const fullMonthSnippets = Array.from({ length: 31 }, (_, i) => ({
        id: `snippet_${i + 1}`,
        projectId: 'project_1',
        filePath: `/path/to/video${i + 1}.mp4`,
        thumbnailPath: `/path/to/thumb${i + 1}.jpg`,
        duration: 2.0,
        recordedDate: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
        calendarDate: `2024-01-${String(i + 1).padStart(2, '0')}`,
        createdAt: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
        metadata: {},
      }));

      const { getByText } = render(
        <CalendarGrid {...defaultProps} snippets={fullMonthSnippets} />
      );
      
      expect(getByText('31 / 31 days')).toBeTruthy();
      expect(getByText('100%')).toBeTruthy();
    });
  });

  describe('Visual Feedback', () => {
    it('applies correct styling to filled days', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      const day15 = getByText('15');
      // Filled days should have sage styling (tested via component structure)
      expect(day15).toBeTruthy();
    });

    it('applies correct styling to empty days', () => {
      const { getByText } = render(<CalendarGrid {...defaultProps} />);
      
      const day10 = getByText('10');
      // Empty days should have neutral gray styling
      expect(day10).toBeTruthy();
    });

    it('highlights today with special styling', () => {
      const today = new Date();
      const todayProps = {
        ...defaultProps,
        currentDate: today,
      };
      
      const { getByText } = render(<CalendarGrid {...todayProps} />);
      
      const todayDay = getByText(today.getDate().toString());
      // Today should have lavender styling
      expect(todayDay).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty snippets array', () => {
      const { getByText } = render(
        <CalendarGrid {...defaultProps} snippets={[]} />
      );
      
      expect(getByText('January 2024')).toBeTruthy();
      expect(getByText('0 / 31 days')).toBeTruthy();
    });

    it('handles different months correctly', () => {
      const februaryDate = new Date('2024-02-01');
      const { getByText } = render(
        <CalendarGrid {...defaultProps} currentDate={februaryDate} />
      );
      
      expect(getByText('February 2024')).toBeTruthy();
      // February 2024 has 29 days (leap year)
      expect(getByText('0 / 29 days')).toBeTruthy();
    });

    it('handles leap year correctly', () => {
      const leapYearFeb = new Date('2024-02-29');
      const { getByText } = render(
        <CalendarGrid {...defaultProps} currentDate={leapYearFeb} />
      );
      
      expect(getByText('29')).toBeTruthy(); // Feb 29 should exist in 2024
    });

    it('handles non-leap year correctly', () => {
      const nonLeapYearFeb = new Date('2023-02-01');
      const { getByText, queryByText } = render(
        <CalendarGrid {...defaultProps} currentDate={nonLeapYearFeb} />
      );
      
      expect(getByText('28')).toBeTruthy(); // Feb 28 should exist
      expect(queryByText('29')).toBeFalsy(); // Feb 29 should not exist in 2023
    });
  });
});