import 'package:flutter/material.dart';

class GoalsScreen extends StatelessWidget {
  const GoalsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Goals")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          ListTile(
            title: Text("Save ₹10,000 for Emergency Fund"),
            subtitle: Text("Progress: ₹6,000 / ₹10,000"),
            trailing: Icon(Icons.trending_up, color: Colors.green),
          ),
          ListTile(
            title: Text("New Laptop Fund"),
            subtitle: Text("Progress: ₹2,500 / ₹8,000"),
            trailing: Icon(Icons.computer, color: Colors.blue),
          ),
        ],
      ),
    );
  }
}
