import 'package:go_router/go_router.dart';
import '../../screens/splash/splash_screen.dart';
import '../../screens/main_tab_view.dart';
import '../../screens/projects/create_project_screen.dart';
import '../../screens/projects/project_detail_screen.dart';
import '../../screens/camera/camera_screen.dart';
import '../../screens/camera/post_capture_screen.dart';
import '../../screens/video/video_player_screen.dart';
import '../../screens/settings/settings_screen.dart';
import '../../screens/explore/explore_screen.dart';
import '../../screens/export/export_screen.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    routes: [
      // Splash screen
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      
      // Main tab navigation
      GoRoute(
        path: '/',
        builder: (context, state) => const MainTabView(),
      ),
      
      // Project routes
      GoRoute(
        path: '/create-project',
        builder: (context, state) => const CreateProjectScreen(),
      ),
      GoRoute(
        path: '/project/:projectId',
        builder: (context, state) {
          final projectId = state.pathParameters['projectId']!;
          return ProjectDetailScreen(projectId: projectId);
        },
      ),
      
      // Camera routes
      GoRoute(
        path: '/camera/:projectId',
        builder: (context, state) {
          final projectId = state.pathParameters['projectId']!;
          return CameraScreen(projectId: projectId);
        },
      ),
      GoRoute(
        path: '/post-capture',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>;
          return PostCaptureScreen(
            videoPath: extra['videoPath'],
            projectId: extra['projectId'],
            duration: extra['duration'],
          );
        },
      ),
      
      // Video player
      GoRoute(
        path: '/video-player/:snippetId',
        builder: (context, state) {
          final snippetId = state.pathParameters['snippetId']!;
          final extra = state.extra as Map<String, dynamic>?;
          return VideoPlayerScreen(
            snippetId: snippetId,
            videoPath: extra?['videoPath'],
          );
        },
      ),
      
      // Settings
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      
      // Explore (hidden tab, accessible via direct navigation)
      GoRoute(
        path: '/explore',
        builder: (context, state) => const ExploreScreen(),
      ),
      
      // Export
      GoRoute(
        path: '/export/:projectId',
        builder: (context, state) {
          final projectId = state.pathParameters['projectId']!;
          return ExportScreen(projectId: projectId);
        },
      ),
    ],
  );
}