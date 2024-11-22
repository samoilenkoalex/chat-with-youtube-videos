import 'package:equatable/equatable.dart';

class ChatResponse extends Equatable {
  final List<SourceDocument> sourceDocuments;
  final List<ChatMessage> chatHistory;

  const ChatResponse({
    required this.sourceDocuments,
    required this.chatHistory,
  });

  factory ChatResponse.fromJson(Map<String, dynamic> json) {
    return ChatResponse(
      sourceDocuments: (json['sourceDocuments'] as List?)?.map((doc) => SourceDocument.fromJson(doc ?? {})).toList() ?? [],
      chatHistory: (json['chatHistory'] as List?)?.map((msg) => ChatMessage.fromJson(msg ?? {})).toList() ?? [],
    );
  }

  @override
  List<Object?> get props => [sourceDocuments, chatHistory];
}

class SourceDocument extends Equatable {
  final String content;
  final Metadata metadata;

  const SourceDocument({
    required this.content,
    required this.metadata,
  });

  factory SourceDocument.fromJson(Map<String, dynamic> json) {
    return SourceDocument(
      content: json['content'] as String? ?? '',
      metadata: Metadata.fromJson(json['metadata'] ?? {}),
    );
  }

  @override
  List<Object?> get props => [content, metadata];
}

class Metadata extends Equatable {
  final String summary;
  final String url;
  final double score;

  const Metadata({
    required this.summary,
    required this.url,
    required this.score,
  });

  factory Metadata.fromJson(Map<String, dynamic> json) {
    return Metadata(
      summary: json['summary'] as String? ?? '',
      url: json['url'] as String? ?? '',
      score: (json['score'] as num?)?.toDouble() ?? 0.0,
    );
  }

  @override
  List<Object?> get props => [summary, url, score];
}

class ChatMessage extends Equatable {
  final String role;
  final String content;

  const ChatMessage({
    required this.role,
    required this.content,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      role: json['role'] as String? ?? '',
      content: json['content'] as String? ?? '',
    );
  }

  @override
  List<Object?> get props => [role, content];
}
