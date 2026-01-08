import 'package:flutter/foundation.dart';
import '../core/database/database_helper.dart';
import '../core/models/snippet.dart';

class SnippetsProvider with ChangeNotifier {
  final DatabaseHelper _databaseHelper = DatabaseHelper();
  final Map<String, List<Snippet>> _snippetsByProject = {};
  bool _isLoading = false;

  List<Snippet> getSnippetsForProject(String projectId) {
    return _snippetsByProject[projectId] ?? [];
  }

  bool get isLoading => _isLoading;

  Future<void> loadSnippetsForProject(String projectId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final snippets = await _databaseHelper.getSnippetsForProject(projectId);
      _snippetsByProject[projectId] = snippets;
    } catch (e) {
      debugPrint('Error loading snippets: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addSnippet(Snippet snippet) async {
    try {
      await _databaseHelper.insertSnippet(snippet);
      
      if (_snippetsByProject[snippet.projectId] == null) {
        _snippetsByProject[snippet.projectId] = [];
      }
      
      _snippetsByProject[snippet.projectId]!.insert(0, snippet);
      notifyListeners();
    } catch (e) {
      debugPrint('Error adding snippet: $e');
      rethrow;
    }
  }

  Future<void> updateSnippet(Snippet snippet) async {
    try {
      await _databaseHelper.updateSnippet(snippet);
      
      final projectSnippets = _snippetsByProject[snippet.projectId];
      if (projectSnippets != null) {
        final index = projectSnippets.indexWhere((s) => s.id == snippet.id);
        if (index != -1) {
          projectSnippets[index] = snippet;
          notifyListeners();
        }
      }
    } catch (e) {
      debugPrint('Error updating snippet: $e');
      rethrow;
    }
  }

  Future<void> deleteSnippet(String snippetId, String projectId) async {
    try {
      await _databaseHelper.deleteSnippet(snippetId);
      
      final projectSnippets = _snippetsByProject[projectId];
      if (projectSnippets != null) {
        projectSnippets.removeWhere((snippet) => snippet.id == snippetId);
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error deleting snippet: $e');
      rethrow;
    }
  }

  void clearSnippetsForProject(String projectId) {
    _snippetsByProject.remove(projectId);
    notifyListeners();
  }
}