import 'package:mobile/services/api_service.dart';

abstract class YoutubeRepository {
  final ApiService apiService;

  YoutubeRepository({required this.apiService});

  Future<String> fetchSubtitles({
    required String query,
    required String openAiKey,
    required String pineconeKey,
    required String pineconeIndex,
    required String tavilyApiKey,
  });
}

class YoutubeRepositoryImpl implements YoutubeRepository {
  @override
  final ApiService apiService;

  YoutubeRepositoryImpl({required this.apiService});

  @override
  Future<String> fetchSubtitles({
    required String query,
    required String openAiKey,
    required String pineconeKey,
    required String pineconeIndex,
    required String tavilyApiKey,
  }) async {
    return await apiService.fetchSubtitles(
      query: query,
      openAiKey: openAiKey,
      pineconeKey: pineconeKey,
      pineconeIndex: pineconeIndex,
      tavilyApiKey: tavilyApiKey,
    );
  }
}
