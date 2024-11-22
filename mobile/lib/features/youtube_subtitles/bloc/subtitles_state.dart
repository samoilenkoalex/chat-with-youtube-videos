part of 'subtitles_bloc.dart';

sealed class SubtitlesState extends Equatable {
  final String query;

  const SubtitlesState({required this.query,});

  @override
  List<Object> get props => [query,];
}

class SubtitlesInitial extends SubtitlesState {
  const SubtitlesInitial() : super(query: '');
}

class SubtitlesLoading extends SubtitlesState {
  const SubtitlesLoading({required super.query});
}

class SubtitlesLoaded extends SubtitlesState {
  final String summary;

  const SubtitlesLoaded({required this.summary, required super.query});

  @override
  List<Object> get props => [summary, query];
}

class SubtitlesError extends SubtitlesState {
  final String message;

  const SubtitlesError({required this.message, required super.query});

  @override
  List<Object> get props => [message, query];
}

class InputChangedState extends SubtitlesState {
  const InputChangedState({required super.query});
}