import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/models/project.dart';
import '../core/theme/tokens.dart';

class ProjectCard extends StatelessWidget {
  final Project project;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const ProjectCard({
    super.key,
    required this.project,
    required this.onTap,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final isTimeline = project.type == ProjectType.timeline;
    // Project types read as distinct brand identities (MiniMax encoding).
    final accent = isTimeline ? AppTokens.brandBlue : AppTokens.brandCoral;

    return Card(
      margin: const EdgeInsets.only(bottom: AppTokens.spaceSm),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTokens.radiusXl),
        child: Padding(
          padding: const EdgeInsets.all(AppTokens.spaceMd),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: accent.withValues(alpha: 0.10),
                  borderRadius: BorderRadius.circular(AppTokens.radiusLg),
                ),
                child: Icon(
                  isTimeline ? Icons.timeline : Icons.video_collection,
                  color: accent,
                ),
              ),
              const SizedBox(width: AppTokens.spaceMd),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      project.name,
                      style: AppTokens.cardTitle,
                    ),
                    const SizedBox(height: AppTokens.spaceXxs),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppTokens.spaceXs,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: accent.withValues(alpha: 0.10),
                            borderRadius:
                                BorderRadius.circular(AppTokens.radiusFull),
                          ),
                          child: Text(
                            isTimeline ? 'Timeline' : 'Freestyle',
                            style: AppTokens.captionBold.copyWith(color: accent),
                          ),
                        ),
                        const SizedBox(width: AppTokens.spaceXs),
                        Text(
                          DateFormat('MMM d, y')
                              .format(project.updatedAt.toLocal()),
                          style: AppTokens.caption,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_horiz, color: AppTokens.steel),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppTokens.radiusLg),
                ),
                onSelected: (value) {
                  if (value == 'delete') {
                    onDelete();
                  }
                },
                itemBuilder: (context) => [
                  PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        const Icon(Icons.delete_outline,
                            color: AppTokens.error),
                        const SizedBox(width: AppTokens.spaceXs),
                        Text('Delete',
                            style: AppTokens.bodySm
                                .copyWith(color: AppTokens.error)),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
