import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:camera/camera.dart';
import 'core/navigation/app_router.dart';
import 'providers/projects_provider.dart';
import 'providers/snippets_provider.dart';
import 'providers/settings_provider.dart';

late List<CameraDescription> cameras;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  try {
    cameras = await availableCameras();
  } catch (e) {
    print('Error initializing cameras: $e');
    cameras = [];
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
            theme: ThemeData(
              colorScheme: ColorScheme.fromSeed(
                seedColor: Colors.blue,
                brightness: settingsProvider.settings?.isDarkTheme == true
                    ? Brightness.dark
                    : Brightness.light,
              ),
              useMaterial3: true,
            ),
            routerConfig: AppRouter.router,
          );
        },
      ),
    );
  }
}
