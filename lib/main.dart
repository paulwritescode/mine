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

  // Initialize database with better error handling
  try {
    final dbHelper = DatabaseHelper();
    await dbHelper.database;
    debugPrint('Database initialized successfully');
    
    // Run debug test in debug mode
    if (kDebugMode) {
      await DebugHelper.testDatabaseConnection();
    }
  } catch (e) {
    debugPrint('Error initializing database: $e');
    // Don't rethrow - let the app continue and handle database errors gracefully
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
        ChangeNotifierProvider(create: (_) => SettingsProvider()),
      ],
      child: Consumer<SettingsProvider>(
        builder: (context, settingsProvider, child) {
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
