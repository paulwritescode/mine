import 'package:flutter/foundation.dart';
import '../core/database/database_helper.dart';
import '../core/models/app_settings.dart';

class SettingsProvider with ChangeNotifier {
  final DatabaseHelper _databaseHelper = DatabaseHelper();
  AppSettings? _settings;
  bool _isLoading = false;
  String? _error;

  AppSettings? get settings => _settings;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadSettings() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _settings = await _databaseHelper.getSettings();
    } catch (e) {
      debugPrint('Error loading settings: $e');
      _error = 'Failed to load settings. Please restart the app.';
      // Provide fallback default settings to prevent infinite loading
      _settings = const AppSettings(
        defaultVideoDuration: 2,
        reminderTime: '20:00',
        notificationsEnabled: true,
        isDarkTheme: false,
      );
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateVideoDuration(int duration) async {
    if (_settings == null) return;

    try {
      final updatedSettings = _settings!.copyWith(defaultVideoDuration: duration);
      await _databaseHelper.updateSettings(updatedSettings);
      _settings = updatedSettings;
      notifyListeners();
    } catch (e) {
      debugPrint('Error updating video duration: $e');
      rethrow;
    }
  }

  Future<void> updateReminderTime(String time) async {
    if (_settings == null) return;

    try {
      final updatedSettings = _settings!.copyWith(reminderTime: time);
      await _databaseHelper.updateSettings(updatedSettings);
      _settings = updatedSettings;
      notifyListeners();
    } catch (e) {
      debugPrint('Error updating reminder time: $e');
      rethrow;
    }
  }

  Future<void> updateNotificationsEnabled(bool enabled) async {
    if (_settings == null) return;

    try {
      final updatedSettings = _settings!.copyWith(notificationsEnabled: enabled);
      await _databaseHelper.updateSettings(updatedSettings);
      _settings = updatedSettings;
      notifyListeners();
    } catch (e) {
      debugPrint('Error updating notifications: $e');
      rethrow;
    }
  }

  Future<void> updateTheme(bool isDark) async {
    if (_settings == null) return;

    try {
      final updatedSettings = _settings!.copyWith(isDarkTheme: isDark);
      await _databaseHelper.updateSettings(updatedSettings);
      _settings = updatedSettings;
      notifyListeners();
    } catch (e) {
      debugPrint('Error updating theme: $e');
      rethrow;
    }
  }
}