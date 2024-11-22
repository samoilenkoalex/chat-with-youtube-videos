import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/common/screens/home_screen.dart';

import '../features/chat/bloc/chat_bloc.dart';
import '../features/chat/repositories/chat_repository.dart';
import '../features/chat/screens/chat_screen.dart';

/* * * * * * * * * * * *
*
* /home
* /pages
*     /pages/1
*     /pages/2
*     ...
*     /pages/test
*
* * * * * * * * * * * */

const String homeRoute = '/home';
const String chatRoute = '/chat';

final globalNavigationKey = GlobalKey<NavigatorState>(debugLabel: 'global');

final goRouter = GoRouter(
  navigatorKey: globalNavigationKey,
  initialLocation: homeRoute,
  routes: [
    GoRoute(
      path: homeRoute,
      pageBuilder: (context, state) => _TransitionPage(
        key: state.pageKey,
        child: const HomeScreen(),
      ),
    ),
    GoRoute(
      path: chatRoute,
      pageBuilder: (context, state) => _TransitionPage(
        key: state.pageKey,
        child: BlocProvider<ChatBloc>(
          create: (context) => ChatBloc(
            context.read<ChatRepository>(),
          ),
          child: const ChatScreen(),
        ),
      ),
    ),
  ],
);

class _TransitionPage extends CustomTransitionPage<dynamic> {
  _TransitionPage({super.key, required super.child})
      : super(
          transitionsBuilder: (
            context,
            animation,
            secondaryAnimation,
            child,
          ) =>
              FadeTransition(
            opacity: animation,
            child: child,
          ),
        );
}
