import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';
import 'package:path/path.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io' show Platform;
import '../constants/app_constants.dart';
import '../models/project.dart';
import '../models/snippet.dart';
import '../models/app_settings.dart';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  factory DatabaseHelper() => _instance;
  DatabaseHelper._internal();

  static Database? _database;

  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    // Initialize the appropriate database factory based on platform
    if (kIsWeb) {
      // Web platform
      databaseFactory = databaseFactoryFfiWeb;
    } else if (Platform.isWindows || Platform.isLinux) {
      // Desktop platforms
      sqfliteFfiInit();
      databaseFactory = databaseFactoryFfi;
    }
    // For mobile (iOS/Android), use the default sqflite

    final databasesPath = await getDatabasesPath();
    final path = join(databasesPath, AppConstants.databaseName);

    return await openDatabase(
      path,
      version: AppConstants.databaseVersion,
      onCreate: _onCreate,
    );
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
    final db = await database;
    await db.insert('projects', project.toMap());
    return project.id;
  }

  Future<List<Project>> getAllProjects() async {
    final db = await database;
    final maps = await db.query('projects', orderBy: 'updated_at DESC');
    return maps.map((map) => Project.fromMap(map)).toList();
  }

  Future<Project?> getProject(String id) async {
    final db = await database;
    final maps = await db.query('projects', where: 'id = ?', whereArgs: [id]);
    if (maps.isNotEmpty) {
      return Project.fromMap(maps.first);
    }
    return null;
  }

  Future<void> updateProject(Project project) async {
    final db = await database;
    await db.update(
      'projects',
      project.toMap(),
      where: 'id = ?',
      whereArgs: [project.id],
    );
  }

  Future<void> deleteProject(String id) async {
    final db = await database;
    await db.delete('projects', where: 'id = ?', whereArgs: [id]);
  }

  // Snippet operations
  Future<String> insertSnippet(Snippet snippet) async {
    final db = await database;
    await db.insert('snippets', snippet.toMap());
    return snippet.id;
  }

  Future<List<Snippet>> getSnippetsForProject(String projectId) async {
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
    final db = await database;
    await db.update(
      'snippets',
      snippet.toMap(),
      where: 'id = ?',
      whereArgs: [snippet.id],
    );
  }

  Future<void> deleteSnippet(String id) async {
    final db = await database;
    await db.delete('snippets', where: 'id = ?', whereArgs: [id]);
  }

  // Settings operations
  Future<AppSettings> getSettings() async {
    final db = await database;
    final maps = await db.query('settings', where: 'id = ?', whereArgs: [1]);
    if (maps.isNotEmpty) {
      return AppSettings.fromMap(maps.first);
    }
    // Return default settings if none found
    return const AppSettings(
      defaultVideoDuration: AppConstants.defaultVideoDuration,
      reminderTime: AppConstants.defaultReminderTime,
      notificationsEnabled: AppConstants.defaultNotificationsEnabled,
      isDarkTheme: false,
    );
  }

  Future<void> updateSettings(AppSettings settings) async {
    final db = await database;
    await db.update(
      'settings',
      settings.toMap(),
      where: 'id = ?',
      whereArgs: [1],
    );
  }
}