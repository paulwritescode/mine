import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/models/snippet.dart';
import '../core/theme/tokens.dart';

class VideoGrid extends StatelessWidget {
  final List<Snippet> snippets;
  final Function(Snippet) onVideoTap;

  const VideoGrid({
    super.key,
    required this.snippets,
    required this.onVideoTap,
  });

  @override
  Widget build(BuildContext context) {
    if (snippets.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                color: AppTokens.surface,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.video_library_outlined,
                size: 40,
                color: AppTokens.steel,
              ),
            ),
            const SizedBox(height: AppTokens.spaceXl),
            Text('No videos yet', style: AppTokens.headingSm),
            const SizedBox(height: AppTokens.spaceXs),
            Text(
              'Start recording to see your videos here',
              style: AppTokens.bodyMd.copyWith(color: AppTokens.slate),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('All Videos (${snippets.length})', style: AppTokens.headingSm),
        const SizedBox(height: AppTokens.spaceMd),
        Expanded(
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: AppTokens.spaceSm,
              mainAxisSpacing: AppTokens.spaceSm,
              childAspectRatio: 0.75,
            ),
            itemCount: snippets.length,
            itemBuilder: (context, index) {
              final snippet = snippets[index];
              return _buildVideoGridItem(context, snippet);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildVideoGridItem(BuildContext context, Snippet snippet) {
    return Card(
      child: InkWell(
        onTap: () => onVideoTap(snippet),
        borderRadius: BorderRadius.circular(AppTokens.radiusXl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Video thumbnail
            Expanded(
              flex: 3,
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [AppTokens.hairline, AppTokens.surface],
                  ),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Play button
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppTokens.inkStrong.withValues(alpha: 0.65),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.play_arrow,
                        color: AppTokens.onDark,
                        size: 20,
                      ),
                    ),
                    // Duration badge
                    Positioned(
                      top: AppTokens.spaceXs,
                      right: AppTokens.spaceXs,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTokens.inkStrong.withValues(alpha: 0.65),
                          borderRadius:
                              BorderRadius.circular(AppTokens.radiusFull),
                        ),
                        child: Text(
                          '${snippet.duration}s',
                          style: AppTokens.micro.copyWith(
                            color: AppTokens.onDark,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Video info
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(AppTokens.spaceXs),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      DateFormat('MMM d').format(snippet.recordedAt.toLocal()),
                      style: AppTokens.micro.copyWith(
                        color: AppTokens.ink,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      DateFormat('h:mm a').format(snippet.recordedAt.toLocal()),
                      style: AppTokens.micro.copyWith(color: AppTokens.slate),
                    ),
                    if (snippet.note != null && snippet.note!.isNotEmpty) ...[
                      const SizedBox(height: AppTokens.spaceXxs),
                      Expanded(
                        child: Text(
                          snippet.note!,
                          style: AppTokens.micro.copyWith(color: AppTokens.stone),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
