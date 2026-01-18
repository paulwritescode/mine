import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:provider/provider.dart';
import 'package:camera/camera.dart';
import 'core/navigation/app_router.dart';
import 'core/database/database_helper.dart';
import 'core/theme/app_theme.dart';
import 'providers/projects_provider.dart';
import 'providers/snippets_provider.dart';
import 'providers/settings_provider.dart';
import 'utils/debug_helper.dart';

late List<CameraDescription> cameras;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  try {
    cameras = await availableCameras();
  } catch (e) {
    debugPrint('Error initializing cameras: $e');
    cameras = [];
  }

  // CRITICAL FIX: Initialize database BEFORE running the app
  try {
    final dbHelper = DatabaseHelper();
    
    // For web, skip database initialization but still test health
    if (kIsWeb) {
      debugPrint('Web platform detected - using mock database');
      final isHealthy = await dbHelper.isDatabaseHealthy();
      debugPrint('Database health check: ${isHealthy ? "PASSED" : "FAILED (expected on web)"}');
    } else {
      // Only initialize actual database on non-web platforms
      await dbHelper.database;
      debugPrint('Database initialized successfully');
      
      // Verify database is working
      final isHealthy = await dbHelper.isDatabaseHealthy();
      debugPrint('Database health check: ${isHealthy ? "PASSED" : "FAILED"}');
    }
    
    // Run debug test in debug mode
    if (kDebugMode && !kIsWeb) {
      await DebugHelper.testDatabaseConnection();
    }
  } catch (e, stackTrace) {
    debugPrint('CRITICAL: Database initialization failed: $e');
    debugPrint('Stack trace: $stackTrace');
    
    // For web, continue anyway since we're using mock data
    if (kIsWeb) {
      debugPrint('Continuing with mock data for web platform');
    } else {
      // Don't continue if database fails on non-web platforms
      rethrow;
    }
  }
  
  runApp(const MineApp());
}

class MineApp extends StatelessWidget {
  const MineApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProjectsProvider()),
        ChangeNotifierProvider(create: (_) => SnippetsProvider()),
        ChangeNotifierProvider(
          create: (_) => SettingsProvider()..loadSettings(),
        ),
      ],
      child: Consumer<SettingsProvider>(
        builder: (context, settingsProvider, child) {
          // Show loading screen while settings are loading
          if (settingsProvider.isLoading) {
            return MaterialApp(
              title: 'Mine',
              debugShowCheckedModeBanner: false,
              theme: AppTheme.lightTheme,
              home: const Scaffold(
                body: Center(
                  child: CircularProgressIndicator(),
                ),
              ),
            );
          }

          return MaterialApp.router(
            title: 'Mine',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: settingsProvider.settings?.isDarkTheme == true
                ? ThemeMode.dark
                : ThemeMode.light,
            routerConfig: AppRouter.router,
          );
        },
      ),
    );
  }
}
