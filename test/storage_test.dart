import 'package:flutter_test/flutter_test.dart';
import 'package:mine/core/storage/storage_service.dart';
import 'package:mine/core/models/project.dart';
import 'package:mine/core/models/snippet.dart';

void main() {
  group('StorageService Tests', () {
    late StorageService storageService;

    setUp(() {
      storageService = StorageService();
      storageService.clearAllData(); // Clear data before each test
    });

    test('should create and retrieve projects', () async {
      final project = Project(name: 'Test Project', type: ProjectType.timeline);
      
      await storageService.insertProject(project);
      final projects = await storageService.getAllProjects();
      
      expect(projects.length, 1);
      expect(projects.first.name, 'Test Project');
      expect(projects.first.type, ProjectType.timeline);
    });

    test('should create and retrieve snippets', () async {
      final project = Project(name: 'Test Project', type: ProjectType.freestyle);
      await storageService.insertProject(project);
      
      final snippet = Snippet(
        projectId: project.id,
        videoPath: '/test/video.mp4',
        duration: 2,
        note: 'Test snippet',
      );
      
      await storageService.insertSnippet(snippet);
      final snippets = await storageService.getSnippetsForProject(project.id);
      
      expect(snippets.length, 1);
      expect(snippets.first.note, 'Test snippet');
      expect(snippets.first.duration, 2);
    });

    test('should update settings', () async {
      final settings = await storageService.getSettings();
      expect(settings.defaultVideoDuration, 2);
      
      final updatedSettings = settings.copyWith(defaultVideoDuration: 3);
      await storageService.updateSettings(updatedSettings);
      
      final newSettings = await storageService.getSettings();
      expect(newSettings.defaultVideoDuration, 3);
    });

    test('should delete projects and associated snippets', () async {
      final project = Project(name: 'Test Project', type: ProjectType.timeline);
      await storageService.insertProject(project);
      
      final snippet = Snippet(
        projectId: project.id,
        videoPath: '/test/video.mp4',
        duration: 2,
      );
      await storageService.insertSnippet(snippet);
      
      await storageService.deleteProject(project.id);
      
      final projects = await storageService.getAllProjects();
      final snippets = await storageService.getSnippetsForProject(project.id);
      
      expect(projects.length, 0);
      expect(snippets.length, 0);
    });
  });
}