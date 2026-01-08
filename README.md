# Mine - Flutter Video Recording App

A Flutter recreation of the Mine app for recording and organizing short video snippets.

## Features Implemented

### ✅ Core Architecture
- **State Management**: Provider pattern for app state
- **Navigation**: GoRouter for deep linking and navigation
- **Database**: SQLite with sqflite for local data persistence
- **Models**: Project, Snippet, and AppSettings data models

### ✅ Screens & UI
- **Main Tab View**: Bottom navigation with Projects, Explore, Settings
- **Projects List**: Display all projects with create/delete functionality
- **Create Project**: Form to create Timeline or Freestyle projects
- **Project Detail**: View project snippets in grid layout
- **Settings**: Configure video duration, notifications, theme
- **Placeholder Screens**: Camera, Video Player, Post-capture (ready for implementation)

### ✅ Data Management
- **Projects Provider**: CRUD operations for projects
- **Snippets Provider**: Manage video snippets per project
- **Settings Provider**: App configuration management
- **Database Helper**: SQLite operations with proper schema

### 🚧 Next Steps (Camera Implementation)
The foundation is complete. Next implementation phases:

1. **Camera Integration**
   - Implement camera preview and recording
   - Video compression and thumbnail generation
   - File system management for video storage

2. **Video Playback**
   - Video player with controls
   - Timeline view for Timeline projects
   - Export and sharing functionality

3. **Advanced Features**
   - Notifications and reminders
   - Calendar grid for Timeline projects
   - Bulk export and sharing

## Project Structure

```
lib/
├── core/
│   ├── constants/app_constants.dart
│   ├── database/database_helper.dart
│   ├── models/
│   └── navigation/app_router.dart
├── providers/
├── screens/
│   ├── camera/
│   ├── projects/
│   ├── settings/
│   └── video/
├── widgets/
└── main.dart
```

## Dependencies

All packages are sourced from pub.dev as specified:
- **provider**: State management
- **go_router**: Navigation and routing
- **sqflite**: SQLite database
- **camera**: Camera functionality (ready for implementation)
- **video_player**: Video playback (ready for implementation)
- **share_plus**: Native sharing
- And more for complete functionality

## Getting Started

```bash
flutter pub get
flutter run
```

The app is ready for camera implementation and follows Flutter best practices with a clean, scalable architecture.
