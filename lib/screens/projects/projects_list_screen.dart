import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/projects_provider.dart';
import '../../core/models/project.dart';
import '../../core/theme/tokens.dart';
import '../../widgets/project_card.dart';

class ProjectsListScreen extends StatefulWidget {
  const ProjectsListScreen({super.key});

  @override
  State<ProjectsListScreen> createState() => _ProjectsListScreenState();
}

class _ProjectsListScreenState extends State<ProjectsListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProjectsProvider>().loadProjects();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mine'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push('/create-project'),
          ),
        ],
      ),
      body: Consumer<ProjectsProvider>(
        builder: (context, projectsProvider, child) {
          if (projectsProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (projectsProvider.projects.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.video_library_outlined,
                    size: 64,
                    color: AppTokens.stone,
                  ),
                  const SizedBox(height: AppTokens.spaceMd),
                  Text(
                    'No projects yet',
                    style: AppTokens.headingSm.copyWith(color: AppTokens.ink),
                  ),
                  const SizedBox(height: AppTokens.spaceXs),
                  Text(
                    'Create your first project to get started',
                    style: AppTokens.bodyMd.copyWith(color: AppTokens.slate),
                  ),
                  const SizedBox(height: AppTokens.spaceXl),
                  ElevatedButton.icon(
                    onPressed: () => context.push('/create-project'),
                    icon: const Icon(Icons.add),
                    label: const Text('Create Project'),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: projectsProvider.projects.length,
            itemBuilder: (context, index) {
              final project = projectsProvider.projects[index];
              return ProjectCard(
                project: project,
                onTap: () => context.push('/project/${project.id}'),
                onDelete: () => _showDeleteDialog(context, project),
              );
            },
          );
        },
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, Project project) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Delete Project'),
          content: Text('Are you sure you want to delete "${project.name}"? This action cannot be undone.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.read<ProjectsProvider>().deleteProject(project.id);
              },
              style: TextButton.styleFrom(foregroundColor: AppTokens.error),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }
}