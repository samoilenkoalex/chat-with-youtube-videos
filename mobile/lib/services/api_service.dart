import 'dart:convert';
import 'dart:developer';

import 'package:http/http.dart' as http;

import '../common/network/exceptions/api_exceptions.dart';
import '../features/chat/models/chat_model.dart';

const String baseUrl = 'http://localhost:3000/api';

class ApiService {
  Future<String> fetchSubtitles({
    required String query,
    required String openAiKey,
    required String pineconeKey,
    required String pineconeIndex,
    required String tavilyApiKey,
  }) async {
    log('search got request: $query');
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/fetch-subtitles'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'query': query,
          'openAiKey': openAiKey,
          'pineconeKey': pineconeKey,
          'pineconeIndex': pineconeIndex,
          'tavilyApiKey': tavilyApiKey,
        }),
      );

      if (response.statusCode == 200) {
        final decodedResponse = jsonDecode(response.body);
        log('response.body: ${decodedResponse['summary']}');
        return decodedResponse['summary'];
      } else {
        throw ApiException('Failed to perform search', statusCode: response.statusCode);
      }
    } on http.ClientException catch (e) {
      throw ApiException('Network error: ${e.message}');
    } on FormatException catch (_) {
      throw ApiException('Failed to parse response');
    } catch (e) {
      throw ApiException('Unexpected error occurred: $e');
    }
  }

  Future<ChatResponse> fetchChatMessage({
    required String query,
  }) async {
    log('message got request: $query');
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/rag-query'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'query': query,
        }),
      );

      if (response.statusCode == 200) {
        final decodedResponse = jsonDecode(response.body) as Map<String, dynamic>?;
        log('response.body: $decodedResponse');

        if (decodedResponse == null) {
          throw ApiException('Received null response from server');
        }

        // Ensure that 'sourceDocuments' and 'chatHistory' are present in the response
        if (!decodedResponse.containsKey('sourceDocuments') || !decodedResponse.containsKey('chatHistory')) {
          throw ApiException('Invalid response structure from server');
        }

        final convertedResponse = ChatResponse.fromJson(decodedResponse);
        return convertedResponse;
      } else {
        throw ApiException('Failed to perform search', statusCode: response.statusCode);
      }
    } on http.ClientException catch (e) {
      throw ApiException('Network error: ${e.message}');
    } on FormatException catch (_) {
      throw ApiException('Failed to parse response');
    } catch (e) {
      throw ApiException('Unexpected error occurred: $e');
    }
  }
}
