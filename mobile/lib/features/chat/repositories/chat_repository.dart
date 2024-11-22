import 'package:mobile/services/api_service.dart';

import '../models/chat_model.dart';



abstract class ChatRepository {
  final ApiService apiService;

  ChatRepository({required this.apiService});

  Future<ChatResponse> fetchMessage(String query);
}

class ChatRepositoryImpl implements ChatRepository {
  @override
  final ApiService apiService;

  ChatRepositoryImpl({required this.apiService});

  @override
  Future<ChatResponse> fetchMessage(String query) async {
    return await apiService.fetchChatMessage(query: query);
  }
}
