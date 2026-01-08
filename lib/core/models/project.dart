import 'package:uuid/uuid.dart';

enum ProjectType { timeline, freestyle }

class Project {
  final String id;
  final String name;
  final ProjectType type;
  final DateTime createdAt;
  final DateTime updatedAt;

  Project({
    String? id,
    required this.name,
    required this.type,
    DateTime? createdAt,
    DateTime? updatedAt,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'type': type.name,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory Project.fromMap(Map<String, dynamic> map) {
    return Project(
      id: map['id'],
      name: map['name'],
      type: ProjectType.values.firstWhere((e) => e.name == map['type']),
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at']),
    );
  }

  Project copyWith({
    String? name,
    ProjectType? type,
    DateTime? updatedAt,
  }) {
    return Project(
      id: id,
      name: name ?? this.name,
      type: type ?? this.type,
      createdAt: createdAt,
      updatedAt: updatedAt ?? DateTime.now(),
    );
  }
}