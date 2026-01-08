import 'package:flutter/foundation.dart';
import '../core/database/database_helper.dart';

class DebugHelper {
  static Future<void> testDatabaseConnection() async {
    try {
      debugPrint('=== Database Debug Test ===');
      
      final dbHelper = DatabaseHelper();
      
      // Test database health
      final isHealthy = await dbHelper.isDatabaseHealthy();
      debugPrint('Database healthy: $isHealthy');
      
      if (isHealthy) {
        // Test settings retrieval
        final settings = await dbHelper.getSettings();
        debugPrint('Settings loaded: ${settings.defaultVideoDuration}s, ${settings.reminderTime}');
        
        // Test projects retrieval
        final projects = await dbHelper.getAllProjects();
        debugPrint('Projects count: ${projects.length}');
      }
      
      debugPrint('=== Database Debug Complete ===');
    } catch (e) {
      debugPrint('Database debug error: $e');
    }
  }
}