import 'package:flutter/foundation.dart';
import '../core/database/database_helper.dart';
import '../core/models/project.dart';
import '../core/models/snippet.dart';

class ProjectsProvider with ChangeNotifier {
  final DatabaseHelper _databaseHelper = DatabaseHelper();
  List<Project> _projects = [];
  bool _isLoading = false;
  String? _error;

  List<Project> get projects => _projects;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadProjects() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Initialize sample data if database is empty
      await _initializeSampleDataIfNeeded();
      _projects = await _databaseHelper.getAllProjects();
    } catch (e) {
      debugPrint('Error loading projects: $e');
      _error = 'Failed to load projects. Please restart the app.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createProject(String name, ProjectType type) async {
    try {
      // Ensure database is initialized before creating project
      await _databaseHelper.database;
      
      final project = Project(name: name, type: type);
      await _databaseHelper.insertProject(project);
      _projects.insert(0, project);
      notifyListeners();
    } catch (e) {
      debugPrint('Error creating project: $e');
      // Provide more specific error message for database issues
      if (e.toString().contains('MissingPluginException') || 
          e.toString().contains('Database initialization failed')) {
        throw Exception('Database initialization failed. Please restart the app and try again.');
      }
      rethrow;
    }
  }

  Future<void> updateProject(Project project) async {
    try {
      final updatedProject = project.copyWith(updatedAt: DateTime.now());
      await _databaseHelper.updateProject(updatedProject);
      
      final index = _projects.indexWhere((p) => p.id == project.id);
      if (index != -1) {
        _projects[index] = updatedProject;
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error updating project: $e');
      rethrow;
    }
  }

  Future<void> deleteProject(String projectId) async {
    try {
      await _databaseHelper.deleteProject(projectId);
      _projects.removeWhere((project) => project.id == projectId);
      notifyListeners();
    } catch (e) {
      debugPrint('Error deleting project: $e');
      rethrow;
    }
  }

  Project? getProjectById(String id) {
    try {
      return _projects.firstWhere((project) => project.id == id);
    } catch (e) {
      return null;
    }
  }

  // Initialize sample data if database is empty (one-time only)
  Future<void> _initializeSampleDataIfNeeded() async {
    final existingProjects = await _databaseHelper.getAllProjects();
    if (existingProjects.isEmpty) {
      await _addSampleData();
    }
  }

  Future<void> _addSampleData() async {
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
    
    await _databaseHelper.insertProject(timelineProject);
    await _databaseHelper.insertProject(freestyleProject);
    
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
      await _databaseHelper.insertSnippet(snippet);
    }
    for (final snippet in freestyleSnippets) {
      await _databaseHelper.insertSnippet(snippet);
    }
  }
}