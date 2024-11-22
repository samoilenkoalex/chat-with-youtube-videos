import 'dart:developer';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../common/network/exceptions/api_exceptions.dart';
import '../repositories/youtube_repository.dart';

part 'subtitles_event.dart';
part 'subtitles_state.dart';

class SubtitlesBloc extends Bloc<SubtitlesEvent, SubtitlesState> {
  final YoutubeRepository youtubeRepository;

  SubtitlesBloc({required this.youtubeRepository}) : super(const SubtitlesInitial()) {
    on<FetchSubtitlesResult>(_onFetchSearchResult);
    on<InputChanged>(_onSearchInputChanged);
  }

  Future<void> _onFetchSearchResult(FetchSubtitlesResult event, Emitter<SubtitlesState> emit) async {
    final currentQuery = state.query;
    emit(SubtitlesLoading(query: currentQuery));

    try {
      final result = await youtubeRepository.fetchSubtitles(
        query: currentQuery,
        openAiKey: event.openAiKey,
        pineconeKey: event.pineconeKey,
        pineconeIndex: event.pineconeIndex,
        tavilyApiKey: event.tavilyApiKey,
      );

      if (result.isNotEmpty) {
        emit(SubtitlesLoaded(summary: result, query: currentQuery));
      } else {
        emit(SubtitlesError(message: 'No results found', query: currentQuery));
      }
    } on ApiException catch (e) {
      log('API Error: ${e.message}');
      if (e.statusCode != null) {
        log('Status Code: ${e.statusCode}');
      }
      emit(SubtitlesError(message: e.message, query: currentQuery));
    } catch (e) {
      log('Unexpected error: $e');
      emit(SubtitlesError(message: e.toString(), query: currentQuery));
    }
  }

  void _onSearchInputChanged(InputChanged event, Emitter<SubtitlesState> emit) {
    emit(InputChangedState(query: event.query));
  }
}
