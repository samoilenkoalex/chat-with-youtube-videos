import 'package:flutter/material.dart';

class SearchFieldWidget extends StatelessWidget {
  final VoidCallback onButtonTap;
  final Function(String) onChanged;

  const SearchFieldWidget({
    super.key,
    required this.onButtonTap,
    required this.onChanged,
  });

  final border = const OutlineInputBorder(
    borderRadius: BorderRadius.horizontal(
      left: Radius.circular(5),
    ),
  );

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Row(
        children: <Widget>[
          Expanded(
            child: TextField(
              decoration: InputDecoration(
                contentPadding: const EdgeInsets.all(10),
                hintText: 'Add Youtube link',
                border: border,
                errorBorder: border,
                disabledBorder: border,
                focusedBorder: border,
                focusedErrorBorder: border,
              ),
              onChanged: (value) {
                onChanged(value);
              },
            ),
          ),
          const SizedBox(
            width: 10,
          ),
          FilledButton(
            style: ButtonStyle(
                shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0),
                  ),
                ),
                padding: WidgetStateProperty.all<EdgeInsetsGeometry>(
                  const EdgeInsets.symmetric(
                    horizontal: 20.0,
                    vertical: (22.0),
                  ),
                )),
            child: const Text('Process'),
            onPressed: () {
              onButtonTap();
            },
          )
        ],
      ),
    );
  }
}
