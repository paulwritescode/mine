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
      body: SafeArea(
        child: Consumer<ProjectsProvider>(
          builder: (context, projectsProvider, child) {
            final projects = projectsProvider.projects;
            final count = projects.length;

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Editorial header
                Padding(
                  padding: const EdgeInsets.fromLTRB(AppTokens.spaceXl,
                      AppTokens.spaceMd, AppTokens.spaceMd, AppTokens.spaceXs),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Mine',
                                style: AppTokens.headingLg
                                    .copyWith(color: AppTokens.ink)),
                            const SizedBox(height: 2),
                            Text(
                              count == 0
                                  ? 'Your video journal'
                                  : count == 1
                                      ? '1 project'
                                      : '$count projects',
                              style: AppTokens.bodySm
                                  .copyWith(color: AppTokens.stone),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add, color: AppTokens.ink),
                        style: IconButton.styleFrom(
                          backgroundColor: AppTokens.surface,
                        ),
                        onPressed: () => context.push('/create-project'),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: projectsProvider.isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : projects.isEmpty
                          ? _buildEmptyState(context)
                          : ListView.builder(
                              padding: const EdgeInsets.fromLTRB(
                                  AppTokens.spaceMd,
                                  AppTokens.spaceXs,
                                  AppTokens.spaceMd,
                                  AppTokens.spaceXxxl),
                              itemCount: projects.length,
                              itemBuilder: (context, index) {
                                final project = projects[index];
                                return ProjectCard(
                                  project: project,
                                  onTap: () =>
                                      context.push('/project/${project.id}'),
                                  onDelete: () =>
                                      _showDeleteDialog(context, project),
                                );
                              },
                            ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppTokens.spaceXl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                color: AppTokens.brandCoral.withValues(alpha: 0.10),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.video_library_outlined,
                size: 40,
                color: AppTokens.brandCoral,
              ),
            ),
            const SizedBox(height: AppTokens.spaceXl),
            Text(
              'No projects yet',
              style: AppTokens.headingSm.copyWith(color: AppTokens.ink),
            ),
            const SizedBox(height: AppTokens.spaceXs),
            Text(
              'Create your first project to get started',
              style: AppTokens.bodyMd.copyWith(color: AppTokens.slate),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppTokens.spaceXl),
            FilledButton.icon(
              onPressed: () => context.push('/create-project'),
              icon: const Icon(Icons.add, size: 18),
              label: const Text('Create Project'),
            ),
          ],
        ),
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