import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:io';
import '../core/models/snippet.dart';
import '../core/theme/tokens.dart';

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
      return Center(
        child: Text(
          'No videos for this date',
          style: AppTokens.bodyMd.copyWith(color: AppTokens.slate),
        ),
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
      margin: const EdgeInsets.only(bottom: AppTokens.spaceMd),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Video thumbnail/preview area
          InkWell(
            onTap: () => onVideoTap(snippet),
            borderRadius:
                const BorderRadius.vertical(top: Radius.circular(AppTokens.radiusXl)),
            child: Container(
              height: 200,
              width: double.infinity,
              decoration: const BoxDecoration(
                color: AppTokens.surface,
                borderRadius:
                    BorderRadius.vertical(top: Radius.circular(AppTokens.radiusXl)),
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
                      color: AppTokens.inkStrong.withValues(alpha: 0.65),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.play_arrow,
                      color: AppTokens.onDark,
                      size: 30,
                    ),
                  ),
                  // Duration badge
                  Positioned(
                    bottom: AppTokens.spaceSm,
                    right: AppTokens.spaceSm,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: AppTokens.spaceXs, vertical: AppTokens.spaceXxs),
                      decoration: BoxDecoration(
                        color: AppTokens.inkStrong.withValues(alpha: 0.65),
                        borderRadius: BorderRadius.circular(AppTokens.radiusFull),
                      ),
                      child: Text(
                        '${snippet.duration}s',
                        style: AppTokens.caption.copyWith(
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
          // Video metadata
          Padding(
            padding: const EdgeInsets.all(AppTokens.spaceMd),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      DateFormat('h:mm a').format(snippet.recordedAt.toLocal()),
                      style: AppTokens.bodyMd.copyWith(
                        color: AppTokens.ink,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (isToday) _buildActionButtons(snippet),
                  ],
                ),
                if (snippet.note != null && snippet.note!.isNotEmpty) ...[
                  const SizedBox(height: AppTokens.spaceXs),
                  Text(
                    snippet.note!,
                    style: AppTokens.bodySm.copyWith(color: AppTokens.slate),
                  ),
                ],
                if (snippet.location != null &&
                    snippet.location!.isNotEmpty) ...[
                  const SizedBox(height: AppTokens.spaceXs),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on,
                        size: 16,
                        color: AppTokens.stone,
                      ),
                      const SizedBox(width: AppTokens.spaceXxs),
                      Expanded(
                        child: Text(
                          snippet.location!,
                          style:
                              AppTokens.caption.copyWith(color: AppTokens.stone),
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
    if (snippet.thumbnailPath != null &&
        File(snippet.thumbnailPath!).existsSync()) {
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
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppTokens.hairline, AppTokens.surface],
        ),
        borderRadius:
            BorderRadius.vertical(top: Radius.circular(AppTokens.radiusXl)),
      ),
      child: const Center(
        child: Icon(
          Icons.videocam,
          size: 48,
          color: AppTokens.steel,
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
            icon: const Icon(Icons.edit_outlined, size: 20),
            onPressed: () => onEditTap!(snippet),
            color: AppTokens.slate,
            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
          ),
        if (onDeleteTap != null)
          IconButton(
            icon: const Icon(Icons.delete_outline, size: 20),
            onPressed: () => onDeleteTap!(snippet),
            color: AppTokens.error,
            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
          ),
      ],
    );
  }
}
