class AppSettings {
  final int defaultVideoDuration;
  final String reminderTime;
  final bool notificationsEnabled;
  final bool isDarkTheme;

  const AppSettings({
    required this.defaultVideoDuration,
    required this.reminderTime,
    required this.notificationsEnabled,
    required this.isDarkTheme,
  });

  Map<String, dynamic> toMap() {
    return {
      'default_video_duration': defaultVideoDuration,
      'reminder_time': reminderTime,
      'notifications_enabled': notificationsEnabled ? 1 : 0,
      'is_dark_theme': isDarkTheme ? 1 : 0,
    };
  }

  factory AppSettings.fromMap(Map<String, dynamic> map) {
    return AppSettings(
      defaultVideoDuration: map['default_video_duration'] ?? 2,
      reminderTime: map['reminder_time'] ?? '20:00',
      notificationsEnabled: (map['notifications_enabled'] ?? 1) == 1,
      isDarkTheme: (map['is_dark_theme'] ?? 0) == 1,
    );
  }

  AppSettings copyWith({
    int? defaultVideoDuration,
    String? reminderTime,
    bool? notificationsEnabled,
    bool? isDarkTheme,
  }) {
    return AppSettings(
      defaultVideoDuration: defaultVideoDuration ?? this.defaultVideoDuration,
      reminderTime: reminderTime ?? this.reminderTime,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      isDarkTheme: isDarkTheme ?? this.isDarkTheme,
    );
  }
}