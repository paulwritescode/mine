import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'dart:io';
import '../constants/app_constants.dart';
import '../models/project.dart';
import '../models/snippet.dart';
import '../models/app_settings.dart';
import 'package:flutter/foundation.dart';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  factory DatabaseHelper() => _instance;
  DatabaseHelper._internal();

  static Database? _database;

  Future<Database> get database async {
    try {
      // For web, skip database initialization temporarily
      if (kIsWeb) {
        throw UnsupportedError('Database not supported on web - using mock data');
      }
      _database ??= await _initDatabase();
      return _database!;
    } catch (e) {
      debugPrint('Database access error: $e');
      rethrow;
    }
  }

  // Health check method to verify database is working
  Future<bool> isDatabaseHealthy() async {
    try {
      // For web, always return false (database disabled)
      if (kIsWeb) {
        return false;
      }
      final db = await database;
      // Simple query to test database connectivity
      await db.rawQuery('SELECT 1');
      return true;
    } catch (e) {
      debugPrint('Database health check failed: $e');
      return false;
    }
  }

  Future<Database> _initDatabase() async {
    try {
      // For web, we need to initialize the database factory first
      if (kIsWeb) {
        // Initialize FFI for web (this is required for web support)
        sqfliteFfiInit();
        databaseFactory = databaseFactoryFfi;
        
        // Use in-memory database for web
        final db = await openDatabase(
          ':memory:',
          version: AppConstants.databaseVersion,
          onCreate: _onCreate,
        );
        debugPrint('Web in-memory database initialized');
        return db;
      }
      
      // Initialize sqflite for desktop platforms (non-web)
      // Only check Platform when not on web
      try {
        if (!Platform.isAndroid && !Platform.isIOS) {
          sqfliteFfiInit();
          databaseFactory = databaseFactoryFfi;
        }
      } catch (e) {
        // If Platform check fails, assume we need FFI
        sqfliteFfiInit();
        databaseFactory = databaseFactoryFfi;
      }
      
      // For mobile platforms (iOS/Android), use the default sqflite
      final databasesPath = await getDatabasesPath();
      
      // CRITICAL FIX: Ensure the database directory exists
      final databaseDir = Directory(databasesPath);
      if (!await databaseDir.exists()) {
        await databaseDir.create(recursive: true);
        debugPrint('Created database directory: $databasesPath');
      }
      
      final path = join(databasesPath, AppConstants.databaseName);
      debugPrint('Database path: $path');

      return await openDatabase(
        path,
        version: AppConstants.databaseVersion,
        onCreate: _onCreate,
        onOpen: (db) async {
          // Ensure foreign key constraints are enabled
          await db.execute('PRAGMA foreign_keys = ON');
        },
      );
    } catch (e) {
      debugPrint('Database initialization error: $e');
      debugPrint('Stack trace: ${StackTrace.current}');
      rethrow;
    }
  }

  Future<void> _onCreate(Database db, int version) async {
    // Projects table
    await db.execute('''
      CREATE TABLE projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    ''');

    // Snippets table
    await db.execute('''
      CREATE TABLE snippets (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        video_path TEXT NOT NULL,
        thumbnail_path TEXT,
        recorded_at INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        note TEXT,
        location TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    ''');

    // Settings table
    await db.execute('''
      CREATE TABLE settings (
        id INTEGER PRIMARY KEY,
        default_video_duration INTEGER NOT NULL,
        reminder_time TEXT NOT NULL,
        notifications_enabled INTEGER NOT NULL,
        is_dark_theme INTEGER NOT NULL
      )
    ''');

    // Insert default settings
    await db.insert('settings', {
      'id': 1,
      'default_video_duration': AppConstants.defaultVideoDuration,
      'reminder_time': AppConstants.defaultReminderTime,
      'notifications_enabled': AppConstants.defaultNotificationsEnabled ? 1 : 0,
      'is_dark_theme': 0,
    });
  }

  // Project operations
  Future<String> insertProject(Project project) async {
    // For web, return mock success
    if (kIsWeb) {
      debugPrint('Mock: Project inserted - ${project.name}');
      return project.id;
    }
    final db = await database;
    await db.insert('projects', project.toMap());
    return project.id;
  }

  Future<List<Project>> getAllProjects() async {
    // For web, return mock projects
    if (kIsWeb) {
      debugPrint('Mock: Returning sample projects');
      return [
        Project(
          id: 'mock-1',
          name: 'Sample Project 1',
          type: ProjectType.timeline,
          createdAt: DateTime.now().subtract(const Duration(days: 7)),
          updatedAt: DateTime.now().subtract(const Duration(days: 1)),
        ),
        Project(
          id: 'mock-2',
          name: 'Sample Project 2',
          type: ProjectType.freestyle,
          createdAt: DateTime.now().subtract(const Duration(days: 3)),
          updatedAt: DateTime.now(),
        ),
      ];
    }
    final db = await database;
    final maps = await db.query('projects', orderBy: 'updated_at DESC');
    return maps.map((map) => Project.fromMap(map)).toList();
  }

  Future<Project?> getProject(String id) async {
    // For web, return mock project
    if (kIsWeb) {
      debugPrint('Mock: Getting project $id');
      return Project(
        id: id,
        name: 'Mock Project',
        type: ProjectType.timeline,
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        updatedAt: DateTime.now(),
      );
    }
    final db = await database;
    final maps = await db.query('projects', where: 'id = ?', whereArgs: [id]);
    if (maps.isNotEmpty) {
      return Project.fromMap(maps.first);
    }
    return null;
  }

  Future<void> updateProject(Project project) async {
    // For web, mock success
    if (kIsWeb) {
      debugPrint('Mock: Project updated - ${project.name}');
      return;
    }
    final db = await database;
    await db.update(
      'projects',
      project.toMap(),
      where: 'id = ?',
      whereArgs: [project.id],
    );
  }

  Future<void> deleteProject(String id) async {
    // For web, mock success
    if (kIsWeb) {
      debugPrint('Mock: Project deleted - $id');
      return;
    }
    final db = await database;
    await db.delete('projects', where: 'id = ?', whereArgs: [id]);
  }

  // Snippet operations
  Future<String> insertSnippet(Snippet snippet) async {
    // For web, mock success
    if (kIsWeb) {
      debugPrint('Mock: Snippet inserted');
      return snippet.id;
    }
    final db = await database;
    await db.insert('snippets', snippet.toMap());
    return snippet.id;
  }

  Future<List<Snippet>> getSnippetsForProject(String projectId) async {
    // For web, return mock snippets
    if (kIsWeb) {
      debugPrint('Mock: Returning sample snippets for project $projectId');
      return [
        Snippet(
          id: 'mock-snippet-1',
          projectId: projectId,
          videoPath: '/mock/path/video1.mp4',
          thumbnailPath: '/mock/path/thumb1.jpg',
          recordedAt: DateTime.now().subtract(const Duration(hours: 2)),
          duration: 30,
          note: 'Sample video snippet',
          location: 'Mock Location',
        ),
      ];
    }
    final db = await database;
    final maps = await db.query(
      'snippets',
      where: 'project_id = ?',
      whereArgs: [projectId],
      orderBy: 'recorded_at DESC',
    );
    return maps.map((map) => Snippet.fromMap(map)).toList();
  }

  Future<void> updateSnippet(Snippet snippet) async {
    // For web, mock success
    if (kIsWeb) {
      debugPrint('Mock: Snippet updated');
      return;
    }
    final db = await database;
    await db.update(
      'snippets',
      snippet.toMap(),
      where: 'id = ?',
      whereArgs: [snippet.id],
    );
  }

  Future<void> deleteSnippet(String id) async {
    // For web, mock success
    if (kIsWeb) {
      debugPrint('Mock: Snippet deleted - $id');
      return;
    }
    final db = await database;
    await db.delete('snippets', where: 'id = ?', whereArgs: [id]);
  }

  // Settings operations
  Future<AppSettings> getSettings() async {
    try {
      // For web, return default settings
      if (kIsWeb) {
        debugPrint('Mock: Returning default settings');
        return const AppSettings(
          defaultVideoDuration: AppConstants.defaultVideoDuration,
          reminderTime: AppConstants.defaultReminderTime,
          notificationsEnabled: AppConstants.defaultNotificationsEnabled,
          isDarkTheme: false,
        );
      }
      
      final db = await database;
      final maps = await db.query('settings', where: 'id = ?', whereArgs: [1]);
      if (maps.isNotEmpty) {
        return AppSettings.fromMap(maps.first);
      }
      // If no settings found, insert default settings and return them
      final defaultSettings = const AppSettings(
        defaultVideoDuration: AppConstants.defaultVideoDuration,
        reminderTime: AppConstants.defaultReminderTime,
        notificationsEnabled: AppConstants.defaultNotificationsEnabled,
        isDarkTheme: false,
      );
      await updateSettings(defaultSettings);
      return defaultSettings;
    } catch (e) {
      debugPrint('Error getting settings: $e');
      // Return default settings as fallback
      return const AppSettings(
        defaultVideoDuration: AppConstants.defaultVideoDuration,
        reminderTime: AppConstants.defaultReminderTime,
        notificationsEnabled: AppConstants.defaultNotificationsEnabled,
        isDarkTheme: false,
      );
    }
  }

  Future<void> updateSettings(AppSettings settings) async {
    try {
      // For web, mock success
      if (kIsWeb) {
        debugPrint('Mock: Settings updated');
        return;
      }
      
      final db = await database;
      final existingSettings = await db.query('settings', where: 'id = ?', whereArgs: [1]);
      
      if (existingSettings.isEmpty) {
        // Insert new settings record
        await db.insert('settings', {
          'id': 1,
          ...settings.toMap(),
        });
      } else {
        // Update existing settings
        await db.update(
          'settings',
          settings.toMap(),
          where: 'id = ?',
          whereArgs: [1],
        );
      }
    } catch (e) {
      debugPrint('Error updating settings: $e');
      rethrow;
    }
  }
}