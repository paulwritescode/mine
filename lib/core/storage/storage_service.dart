import '../models/project.dart';
import '../models/snippet.dart';
import '../models/app_settings.dart';
import '../constants/app_constants.dart';

/// Temporary in-memory storage service for cross-platform compatibility
/// This will be replaced with proper database implementation later
class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  // In-memory storage
  final List<Project> _projects = [];
  final Map<String, List<Snippet>> _snippetsByProject = {};
  AppSettings _settings = const AppSettings(
    defaultVideoDuration: AppConstants.defaultVideoDuration,
    reminderTime: AppConstants.defaultReminderTime,
    notificationsEnabled: AppConstants.defaultNotificationsEnabled,
    isDarkTheme: false,
  );

  // Project operations
  Future<String> insertProject(Project project) async {
    _projects.add(project);
    return project.id;
  }

  Future<List<Project>> getAllProjects() async {
    // Sort by updated date descending
    _projects.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
    return List.from(_projects);
  }

  Future<Project?> getProject(String id) async {
    try {
      return _projects.firstWhere((project) => project.id == id);
    } catch (e) {
      return null;
    }
  }

  Future<void> updateProject(Project project) async {
    final index = _projects.indexWhere((p) => p.id == project.id);
    if (index != -1) {
      _projects[index] = project;
    }
  }

  Future<void> deleteProject(String id) async {
    _projects.removeWhere((project) => project.id == id);
    _snippetsByProject.remove(id);
  }

  // Snippet operations
  Future<String> insertSnippet(Snippet snippet) async {
    if (_snippetsByProject[snippet.projectId] == null) {
      _snippetsByProject[snippet.projectId] = [];
    }
    _snippetsByProject[snippet.projectId]!.add(snippet);
    return snippet.id;
  }

  Future<List<Snippet>> getSnippetsForProject(String projectId) async {
    final snippets = _snippetsByProject[projectId] ?? [];
    // Sort by recorded date descending
    snippets.sort((a, b) => b.recordedAt.compareTo(a.recordedAt));
    return List.from(snippets);
  }

  Future<void> updateSnippet(Snippet snippet) async {
    final projectSnippets = _snippetsByProject[snippet.projectId];
    if (projectSnippets != null) {
      final index = projectSnippets.indexWhere((s) => s.id == snippet.id);
      if (index != -1) {
        projectSnippets[index] = snippet;
      }
    }
  }

  Future<void> deleteSnippet(String id, String projectId) async {
    final projectSnippets = _snippetsByProject[projectId];
    if (projectSnippets != null) {
      projectSnippets.removeWhere((snippet) => snippet.id == id);
    }
  }

  // Settings operations
  Future<AppSettings> getSettings() async {
    return _settings;
  }

  Future<void> updateSettings(AppSettings settings) async {
    _settings = settings;
  }

  // Debug method to add sample data
  Future<void> addSampleData() async {
    if (_projects.isEmpty) {
      final now = DateTime.now();
      
      // Demo Timeline Project - Educational content about timeline features
      final timelineProject = Project(
        name: '🎬 Demo: My Daily Timeline',
        type: ProjectType.timeline,
      );
      
      // Demo Freestyle Project - Educational content about freestyle features  
      final freestyleProject = Project(
        name: '🎨 Demo: Creative Moments',
        type: ProjectType.freestyle,
      );
      
      await insertProject(timelineProject);
      await insertProject(freestyleProject);
      
      // Add educational demo snippets for Timeline project
      final timelineSnippets = [
        Snippet(
          projectId: timelineProject.id,
          videoPath: '/demo/timeline_morning.mp4',
          duration: 3,
          recordedAt: now.subtract(const Duration(hours: 8)),
          note: '☀️ Morning routine - Timeline projects help you capture your day chronologically. Try recording moments throughout your day!',
          location: 'Home - Kitchen',
        ),
        Snippet(
          projectId: timelineProject.id,
          videoPath: '/demo/timeline_work.mp4',
          duration: 2,
          recordedAt: now.subtract(const Duration(hours: 4)),
          note: '💼 Work session - Each snippet in a timeline shows when it was recorded. Perfect for daily vlogs or documenting progress!',
          location: 'Office',
        ),
        Snippet(
          projectId: timelineProject.id,
          videoPath: '/demo/timeline_evening.mp4',
          duration: 4,
          recordedAt: now.subtract(const Duration(hours: 1)),
          note: '🌅 Evening reflection - Timeline view shows your snippets in chronological order. Tap the calendar to see different days!',
          location: 'Home - Living Room',
        ),
      ];
      
      // Add educational demo snippets for Freestyle project
      final freestyleSnippets = [
        Snippet(
          projectId: freestyleProject.id,
          videoPath: '/demo/freestyle_creative.mp4',
          duration: 5,
          recordedAt: now.subtract(const Duration(days: 2)),
          note: '🎨 Creative experiment - Freestyle projects let you organize videos by theme, not time. Perfect for tutorials, recipes, or creative content!',
          location: 'Art Studio',
        ),
        Snippet(
          projectId: freestyleProject.id,
          videoPath: '/demo/freestyle_tutorial.mp4',
          duration: 6,
          recordedAt: now.subtract(const Duration(days: 1)),
          note: '📚 How-to guide - In freestyle mode, you can reorder snippets by dragging them. Great for step-by-step content!',
          location: 'Workshop',
        ),
        Snippet(
          projectId: freestyleProject.id,
          videoPath: '/demo/freestyle_inspiration.mp4',
          duration: 3,
          recordedAt: now.subtract(const Duration(hours: 12)),
          note: '💡 Random inspiration - Collect moments of inspiration and organize them however makes sense to you. Export when ready!',
          location: 'Café Downtown',
        ),
      ];
      
      // Insert all demo snippets
      for (final snippet in timelineSnippets) {
        await insertSnippet(snippet);
      }
      for (final snippet in freestyleSnippets) {
        await insertSnippet(snippet);
      }
    }
  }

  // Method to clear all data (for testing)
  void clearAllData() {
    _projects.clear();
    _snippetsByProject.clear();
    _settings = const AppSettings(
      defaultVideoDuration: AppConstants.defaultVideoDuration,
      reminderTime: AppConstants.defaultReminderTime,
      notificationsEnabled: AppConstants.defaultNotificationsEnabled,
      isDarkTheme: false,
    );
  }
}