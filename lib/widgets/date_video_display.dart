import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:io';
import '../core/models/snippet.dart';

class DateVideoDisplay extends StatelessWidget {
  final List<Snippet> snippets;
  final bool isToday;
  final Function(Snippet) onVideoTap;
  final Function(Snippet)? onEditTap;
  final Function(Snippet)? onDeleteTap;

  const DateVideoDisplay({
    super.key,
    required this.snippets,
    required this.isToday,
    required this.onVideoTap,
    this.onEditTap,
    this.onDeleteTap,
  });

  @override
  Widget build(BuildContext context) {
    if (snippets.isEmpty) {
      return const Center(
        child: Text('No videos for this date'),
      );
    }

    return ListView.builder(
      itemCount: snippets.length,
      itemBuilder: (context, index) {
        final snippet = snippets[index];
        return _buildVideoCard(context, snippet);
      },
    );
  }

  Widget _buildVideoCard(BuildContext context, Snippet snippet) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Video thumbnail/preview area
          InkWell(
            onTap: () => onVideoTap(snippet),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Video thumbnail or placeholder
                  _buildThumbnail(snippet),
                  // Play button overlay
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.7),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.play_arrow,
                      color: Colors.white,
                      size: 30,
                    ),
                  ),
                  // Duration badge
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.7),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${snippet.duration}s',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Video metadata
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      DateFormat('h:mm a').format(snippet.recordedAt.toLocal()),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    if (isToday) _buildActionButtons(snippet),
                  ],
                ),
                if (snippet.note != null && snippet.note!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    snippet.note!,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
                if (snippet.location != null && snippet.location!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 16,
                        color: Colors.grey[500],
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          snippet.location!,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[500],
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildThumbnail(Snippet snippet) {
    if (snippet.thumbnailPath != null && File(snippet.thumbnailPath!).existsSync()) {
      return Image.file(
        File(snippet.thumbnailPath!),
        width: double.infinity,
        height: double.infinity,
        fit: BoxFit.cover,
      );
    }
    
    // Fallback placeholder
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.grey[300]!,
            Colors.grey[100]!,
          ],
        ),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
      ),
      child: const Center(
        child: Icon(
          Icons.videocam,
          size: 48,
          color: Colors.grey,
        ),
      ),
    );
  }

  Widget _buildActionButtons(Snippet snippet) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (onEditTap != null)
          IconButton(
            icon: const Icon(Icons.edit, size: 20),
            onPressed: () => onEditTap!(snippet),
            color: Colors.grey[600],
            constraints: const BoxConstraints(
              minWidth: 32,
              minHeight: 32,
            ),
          ),
        if (onDeleteTap != null)
          IconButton(
            icon: const Icon(Icons.delete, size: 20),
            onPressed: () => onDeleteTap!(snippet),
            color: Colors.red[400],
            constraints: const BoxConstraints(
              minWidth: 32,
              minHeight: 32,
            ),
          ),
      ],
    );
  }
}