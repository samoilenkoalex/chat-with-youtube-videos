part of 'chat_bloc.dart';
abstract class ChatState extends Equatable {
  final List<ChatMessage> messages;
  const ChatState(this.messages);

  @override
  List<Object> get props => [messages];
}

class MessageInitial extends ChatState {
  const MessageInitial() : super(const []);
}

class ChatLoading extends ChatState {
  const ChatLoading(super.messages);
}

class MessagesLoaded extends ChatState {
  const MessagesLoaded(super.messages);
}

class MessageAdded extends ChatState {
  const MessageAdded(super.messages);
}

class MessageError extends ChatState {
  final String error;
  const MessageError(this.error, List<ChatMessage> messages) : super(messages);

  @override
  List<Object> get props => [error, messages];
}