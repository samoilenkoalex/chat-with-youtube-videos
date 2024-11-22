import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/common/router.dart';

import '../bloc/subtitles_bloc.dart';

class SummaryWidget extends StatelessWidget {
  const SummaryWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<SubtitlesBloc, SubtitlesState>(builder: (context, state) {
      if (state is SubtitlesLoading) {
        return const Column(
          children: [
            SizedBox(
              height: 20,
            ),
            CircularProgressIndicator(),
          ],
        );
      } else if (state is SubtitlesLoaded) {
        return Column(
          children: [
            Text(state.summary.toString()),
            const SizedBox(
              height: 20,
            ),
            FilledButton(
              onPressed: () {
                context.push(chatRoute);
              },
              child: const Text('Chat'),
            )
          ],
        );
      } else {
        return const Column(
          children: [
            SizedBox(
              height: 20,
            ),
            Text('Add youtube link to get subtitles'),
          ],
        );
      }
    });
  }
}
