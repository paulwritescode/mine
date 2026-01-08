import 'package:flutter/foundation.dart';
import '../core/storage/storage_service.dart';
import '../core/models/project.dart';

class ProjectsProvider with ChangeNotifier {
  final StorageService _storageService = StorageService();
  List<Project> _projects = [];
  bool _isLoading = false;

  List<Project> get projects => _projects;
  bool get isLoading => _isLoading;

  Future<void> loadProjects() async {
    _isLoading = true;
    notifyListeners();

    try {
      // Add sample data for demo purposes
      await _storageService.addSampleData();
      _projects = await _storageService.getAllProjects();
    } catch (e) {
      debugPrint('Error loading projects: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createProject(String name, ProjectType type) async {
    try {
      final project = Project(name: name, type: type);
      await _storageService.insertProject(project);
      _projects.insert(0, project);
      notifyListeners();
    } catch (e) {
      debugPrint('Error creating project: $e');
      rethrow;
    }
  }

  Future<void> updateProject(Project project) async {
    try {
      final updatedProject = project.copyWith(updatedAt: DateTime.now());
      await _storageService.updateProject(updatedProject);
      
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
      await _storageService.deleteProject(projectId);
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
}