import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/models/snippet.dart';

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
              decoration: BoxDecoration(
                color: Colors.grey[100],
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.video_library_outlined,
                size: 40,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No videos yet',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Start recording to see your videos here',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'All Videos (${snippets.length})',
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 16),
        Expanded(
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
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
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () => onVideoTap(snippet),
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Video thumbnail
            Expanded(
              flex: 3,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Colors.grey[300]!,
                      Colors.grey[100]!,
                    ],
                  ),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Play button
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.play_arrow,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                    // Duration badge
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${snippet.duration}s',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
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
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      DateFormat('MMM d').format(snippet.recordedAt.toLocal()),
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      DateFormat('h:mm a').format(snippet.recordedAt.toLocal()),
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.grey[600],
                      ),
                    ),
                    if (snippet.note != null && snippet.note!.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Expanded(
                        child: Text(
                          snippet.note!,
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.grey[500],
                          ),
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