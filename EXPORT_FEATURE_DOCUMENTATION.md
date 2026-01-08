# Export Project Feature

## Overview
The export project feature allows users to concatenate all videos in a project into one long video file using FFmpeg. This feature includes comprehensive save and share functionality for the exported videos.

## Features

### 1. Video Concatenation
- **Automatic Sorting**: Videos are automatically sorted by recording date (chronological order)
- **Multiple Formats**: Supports various video formats through FFmpeg
- **Quality Preservation**: Uses copy codec when possible to maintain original quality
- **Fallback Re-encoding**: Automatically falls back to re-encoding if direct concatenation fails

### 2. Export Screen
- **Project Overview**: Shows project name, video count, and total duration
- **Video List**: Displays all videos with timestamps, notes, and duration
- **Progress Tracking**: Real-time progress indicator during export
- **Export Status**: Clear status messages throughout the process

### 3. Save & Share Integration
- **Save to Gallery**: Save exported video directly to device photo gallery
- **Share Functionality**: Share exported video via platform share dialog
- **Options Modal**: Clean interface for choosing save or share options
- **Permission Handling**: Automatic permission requests for gallery access
- **Success Feedback**: Clear confirmation messages for user actions

## Technical Implementation

### Dependencies
```yaml
ffmpeg_kit_flutter: ^6.0.3  # Video processing
share_plus: ^12.0.1         # Modern sharing functionality
gal: ^2.3.0                 # Gallery saving with permission handling
```

### Key Components

#### 1. ExportScreen (`lib/screens/export/export_screen.dart`)
- Main UI for the export feature
- Displays project information and video list
- Handles export progress and save/share options
- Modern SharePlus API integration

#### 2. VideoExportService (`lib/services/video_export_service.dart`)
- Core video concatenation logic
- FFmpeg command execution
- Progress callbacks and error handling
- Gallery save functionality with Gal package
- Permission management utilities

#### 3. Navigation Integration
- Added export route: `/export/:projectId`
- Updated project detail screen with export button
- Replaced share menu item with export option

### Export Process

1. **Validation**: Check if videos exist and are accessible
2. **Sorting**: Sort videos by recording date (chronological order)
3. **Single Video**: If only one video, copy directly to export folder
4. **Multiple Videos**: 
   - First attempt: Use FFmpeg concat demuxer (fast, no re-encoding)
   - Fallback: Use filter_complex for re-encoding if concat fails
5. **Progress Updates**: Real-time progress callbacks to UI
6. **Completion**: Save to exports folder and enable save/share options

### Save & Share Options

#### Save to Gallery
- Uses `gal` package for cross-platform gallery saving
- Automatic permission handling (no manual permission_handler needed)
- Supports Android (API 21+) and iOS (11+)
- Clear success/error feedback to user

#### Share Functionality
- Modern SharePlus.instance.share() API
- Cross-platform sharing via native share dialogs
- Supports sharing to any app that accepts video files
- Optional success status handling

### File Structure
```
documents/
├── videos/           # Original recorded videos
├── thumbnails/       # Video thumbnails
└── exports/          # Exported concatenated videos
    └── export_[timestamp].mp4
```

## Usage

### From Project Detail Screen
1. Open any project with videos
2. Tap the export button (download icon) in the header
3. Or use the "Export Project" option in the menu

### Export Process
1. Review project information and video list
2. Tap "Export Project" button
3. Monitor progress bar and status messages
4. Once complete, tap "Save & Share" for options

### Save & Share Options
1. **Save to Gallery**: Saves video to device photo gallery
   - Automatic permission request if needed
   - Success confirmation message
   - Video appears in gallery app immediately

2. **Share Video**: Opens platform share dialog
   - Share to any compatible app (Messages, Email, Social Media, etc.)
   - Includes project name in share text
   - Success feedback when sharing completes

## Permissions

### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
<uses-permission android:name="android.permission.ACCESS_MEDIA_LOCATION" />
```

### iOS (Info.plist)
```xml
<key>NSPhotoLibraryAddUsageDescription</key>
<string>This app needs access to photo library to save exported videos</string>
```

## Error Handling

### Common Issues
- **Missing Videos**: Validates all video files exist before processing
- **Codec Incompatibility**: Automatically falls back to re-encoding
- **Storage Space**: Checks available space before export
- **Permission Issues**: Handles gallery permissions gracefully
- **Gallery Save Errors**: Clear error messages with specific failure reasons

### Error Messages
- Clear, user-friendly error messages
- Detailed logging for debugging
- Graceful fallback mechanisms
- Permission request guidance

## UI/UX Improvements

### Export Options Modal
- Clean bottom sheet design with option tiles
- Clear icons and descriptions for each action
- Consistent with app's dark theme
- Easy dismissal and navigation

### Progress Feedback
- Real-time progress bar during export
- Status messages for each export phase
- Loading indicators for save operations
- Success confirmations with appropriate colors

### User Experience
- Single "Save & Share" button after export completion
- Options modal prevents accidental actions
- Clear success/error feedback
- Consistent with platform sharing patterns

## Performance Considerations

### Optimization Strategies
1. **Copy Mode**: Uses `-c copy` when videos have compatible codecs
2. **Fast Preset**: Uses `-preset fast` for re-encoding when needed
3. **Progress Callbacks**: Efficient progress reporting without blocking UI
4. **Memory Management**: Processes videos sequentially to manage memory usage

### Expected Performance
- **Copy Mode**: Very fast, depends mainly on file I/O
- **Re-encode Mode**: Slower, depends on video length and device performance
- **Typical Times**: 
  - 5 videos (10 seconds each): ~5-15 seconds
  - 20 videos (5 seconds each): ~10-30 seconds

## Future Enhancements

### Planned Features
1. **Export Quality Options**: Allow users to choose output quality
2. **Custom Order**: Option to reorder videos before export
3. **Trim Videos**: Trim individual videos during export
4. **Add Transitions**: Simple transitions between videos
5. **Background Export**: Export in background with notifications
6. **Batch Export**: Export multiple projects at once

### Technical Improvements
1. **Progress Accuracy**: More precise progress calculation
2. **Cancellation**: Allow users to cancel ongoing exports
3. **Resume Capability**: Resume interrupted exports
4. **Cloud Export**: Direct export to cloud storage services

## Testing

### Test Scenarios
1. **Single Video Export**: Verify copy functionality
2. **Multiple Video Export**: Test concatenation
3. **Mixed Formats**: Test with different video formats
4. **Large Projects**: Test with many videos (20+)
5. **Error Conditions**: Test with missing/corrupted videos
6. **Share Integration**: Verify sharing works on different platforms

### Performance Testing
- Memory usage during export
- Export time vs video count/duration
- Storage space requirements
- Battery usage during export

## Troubleshooting

### Common Solutions
1. **Export Fails**: Check available storage space
2. **Slow Export**: Close other apps to free up memory
3. **Share Fails**: Check app permissions for sharing
4. **Quality Issues**: Ensure original videos are good quality

### Debug Information
- Export logs are available in app documents directory
- FFmpeg execution logs for detailed error analysis
- Progress tracking for identifying bottlenecks