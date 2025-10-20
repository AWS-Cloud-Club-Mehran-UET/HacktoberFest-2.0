import 'package:flutter/material.dart';

class AchievementsScreen extends StatelessWidget {
  const AchievementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Achievements")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          ListTile(
            leading: Icon(Icons.star, color: Colors.amber),
            title: Text("First Budget Created"),
            subtitle: Text("Earned: 50 points"),
          ),
          ListTile(
            leading: Icon(Icons.emoji_events, color: Colors.purple),
            title: Text("Saved 5 Days in a Row"),
            subtitle: Text("Earned: 100 points"),
          ),
          ListTile(
            leading: Icon(Icons.military_tech, color: Colors.green),
            title: Text("Under Budget This Month"),
            subtitle: Text("Earned: 150 points"),
          ),
        ],
      ),
    );
  }
}
