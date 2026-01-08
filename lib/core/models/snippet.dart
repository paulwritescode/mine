import 'package:uuid/uuid.dart';

class Snippet {
  final String id;
  final String projectId;
  final String videoPath;
  final String? thumbnailPath;
  final DateTime recordedAt;
  final int duration; // in seconds
  final String? note;
  final String? location;

  Snippet({
    String? id,
    required this.projectId,
    required this.videoPath,
    this.thumbnailPath,
    DateTime? recordedAt,
    required this.duration,
    this.note,
    this.location,
  })  : id = id ?? const Uuid().v4(),
        recordedAt = recordedAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'project_id': projectId,
      'video_path': videoPath,
      'thumbnail_path': thumbnailPath,
      'recorded_at': recordedAt.millisecondsSinceEpoch,
      'duration': duration,
      'note': note,
      'location': location,
    };
  }

  factory Snippet.fromMap(Map<String, dynamic> map) {
    return Snippet(
      id: map['id'],
      projectId: map['project_id'],
      videoPath: map['video_path'],
      thumbnailPath: map['thumbnail_path'],
      recordedAt: DateTime.fromMillisecondsSinceEpoch(map['recorded_at']),
      duration: map['duration'],
      note: map['note'],
      location: map['location'],
    );
  }

  Snippet copyWith({
    String? note,
    String? location,
    String? thumbnailPath,
  }) {
    return Snippet(
      id: id,
      projectId: projectId,
      videoPath: videoPath,
      thumbnailPath: thumbnailPath ?? this.thumbnailPath,
      recordedAt: recordedAt,
      duration: duration,
      note: note ?? this.note,
      location: location ?? this.location,
    );
  }
}