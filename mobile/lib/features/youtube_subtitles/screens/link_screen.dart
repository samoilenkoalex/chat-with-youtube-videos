import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/subtitles_bloc.dart';
import '../widgets/search_field_widget.dart';
import '../widgets/summary_widget.dart';

class LinkScreen extends StatefulWidget {
  const LinkScreen({super.key});

  @override
  State<LinkScreen> createState() => _LinkScreenState();
}

class _LinkScreenState extends State<LinkScreen> {
  TextEditingController openAiController = TextEditingController();
  TextEditingController pineconeApiController = TextEditingController();
  TextEditingController pineconeIndexController = TextEditingController();
  TextEditingController tavilyApiKeyController = TextEditingController();
  String errorText = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
        child: Column(
          children: [
            Text('Add your credentials to start using the app', style: Theme.of(context).textTheme.headlineSmall),
            Row(mainAxisSize: MainAxisSize.min, children: [
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      const SizedBox(height: 20),
                      buildTextFormField(controller: openAiController, hintText: 'Enter OpenAI API Key'),
                      const SizedBox(height: 20),
                      buildTextFormField(controller: pineconeApiController, hintText: 'Enter Pinecone API Key'),
                    ],
                  ),
                ),
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      const SizedBox(height: 20),
                      buildTextFormField(controller: pineconeIndexController, hintText: 'Enter Pinecone Index'),
                      const SizedBox(height: 20),
                      buildTextFormField(controller: tavilyApiKeyController, hintText: 'Enter Tavily API Key'),
                    ],
                  ),
                ),
              ),
            ]),
            Text(errorText, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 80),
            Column(
              children: [
                SearchFieldWidget(
                  onChanged: (value) {
                    context.read<SubtitlesBloc>().add(InputChanged(value));
                  },
                  onButtonTap: () {
                    if (openAiController.text.isNotEmpty && pineconeApiController.text.isNotEmpty && pineconeIndexController.text.isNotEmpty && tavilyApiKeyController.text.isNotEmpty) {
                      context.read<SubtitlesBloc>().add(FetchSubtitlesResult(
                            openAiKey: openAiController.text,
                            pineconeKey: pineconeApiController.text,
                            pineconeIndex: pineconeIndexController.text,
                            tavilyApiKey: tavilyApiKeyController.text,
                          ));
                    } else {
                      setState(() => errorText = 'Please enter all the credentials');
                      log('Please enter all the credentials');
                    }
                  },
                ),
                const SummaryWidget(),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget buildTextFormField({required TextEditingController controller, required String hintText}) {
    return TextFormField(
      controller: controller,
      obscureText: true,
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.all(10),
        hintText: hintText,
      ),
    );
  }
}
