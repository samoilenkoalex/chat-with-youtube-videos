import 'dart:developer';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/features/chat/repositories/chat_repository.dart';

import '../../../common/network/exceptions/api_exceptions.dart';
import '../models/chat_model.dart';

part 'chat_event.dart';
part 'chat_state.dart';

class ChatBloc extends Bloc<ChatEvent, ChatState> {
  final ChatRepository chatRepository;

  ChatBloc(this.chatRepository) : super(const MessageInitial()) {
    on<SendMessage>(_onSendMessage);
    on<AddMessage>(_onAddMessage);
  }

  Future<void> _onSendMessage(SendMessage event, Emitter<ChatState> emit) async {
    try {
      // Add the user's message
      final updatedMessages = List<ChatMessage>.from(state.messages)..add(ChatMessage(role: 'user', content: event.message));

      log('state.messages: ${state.messages}');
      // Emit loading state with the updated messages (including user's message)
      emit(ChatLoading(updatedMessages));

      final response = await chatRepository.fetchMessage(event.message);

      // Add the assistant's response
      updatedMessages.addAll(response.chatHistory.where((msg) => msg.role == 'assistant'));

      emit(MessagesLoaded(updatedMessages));
    } on ApiException catch (e) {
      emit(MessageError(e.message, state.messages));
    } catch (e) {
      emit(MessageError('An unexpected error occurred. Please try again later.', state.messages));
    }
  }

  Future<void> _onAddMessage(AddMessage event, Emitter<ChatState> emit) async {
    try {
      final updatedMessages = List<ChatMessage>.from(state.messages)..add(event.message);
      emit(MessageAdded(updatedMessages));
    } catch (e) {
      emit(MessageError(e.toString(), state.messages));
    }
  }
}
