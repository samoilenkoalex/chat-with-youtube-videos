part of 'subtitles_bloc.dart';

sealed class SubtitlesEvent extends Equatable {
  const SubtitlesEvent();
}

final class FetchSubtitlesResult extends SubtitlesEvent {
  final String openAiKey;
  final String pineconeKey;
  final String pineconeIndex;
  final String tavilyApiKey;

  const FetchSubtitlesResult({
    required this.pineconeIndex,
    required this.tavilyApiKey,
    required this.openAiKey,
    required this.pineconeKey,
  });

  @override
  List<Object> get props => [openAiKey, pineconeKey, pineconeIndex, tavilyApiKey];
}

final class InputChanged extends SubtitlesEvent {
  final String query;

  const InputChanged(this.query);

  @override
  List<Object> get props => [query];
}
