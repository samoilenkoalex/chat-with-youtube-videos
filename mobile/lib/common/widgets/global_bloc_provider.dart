import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../features/youtube_subtitles/bloc/subtitles_bloc.dart';
import '../../features/youtube_subtitles/repositories/youtube_repository.dart';

class GlobalBlocProvider extends StatelessWidget {
  const GlobalBlocProvider({
    super.key,
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<SubtitlesBloc>(
          create: (context) => SubtitlesBloc(
            youtubeRepository: context.read<YoutubeRepository>(),
          ),
        ),
      ],
      child: child,
    );
  }
}
