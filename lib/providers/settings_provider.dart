import 'package:flutter/foundation.dart';
import '../core/storage/storage_service.dart';
import '../core/models/app_settings.dart';

class SettingsProvider with ChangeNotifier {
  final StorageService _storageService = StorageService();
  AppSettings? _settings;
  bool _isLoading = false;

  AppSettings? get settings => _settings;
  bool get isLoading => _isLoading;

  Future<void> loadSettings() async {
    _isLoading = true;
    notifyListeners();

    try {
      _settings = await _storageService.getSettings();
    } catch (e) {
      debugPrint('Error loading settings: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateVideoDuration(int duration) async {
    if (_settings == null) return;

    try {
      final updatedSettings = _settings!.copyWith(defaultVideoDuration: duration);
      await _storageService.updateSettings(updatedSettings);
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
      await _storageService.updateSettings(updatedSettings);
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
      await _storageService.updateSettings(updatedSettings);
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
      await _storageService.updateSettings(updatedSettings);
      _settings = updatedSettings;
      notifyListeners();
    } catch (e) {
      debugPrint('Error updating theme: $e');
      rethrow;
    }
  }
}