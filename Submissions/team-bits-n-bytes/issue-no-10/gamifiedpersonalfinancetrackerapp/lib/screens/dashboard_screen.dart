import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: Colors.teal,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 💰 User Balance
            const Text(
              "Your Balance",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text(
              "₹ 12,500",
              style: TextStyle(fontSize: 26, color: Colors.teal),
            ),

            const Divider(height: 30),

            // 📊 Spending Overview
            const Text(
              "Spending Overview",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 10),
            ListTile(
              leading: const Icon(Icons.fastfood, color: Colors.orange),
              title: const Text("Food"),
              trailing: const Text("₹ 1,200"),
            ),
            ListTile(
              leading: const Icon(Icons.directions_bus, color: Colors.blue),
              title: const Text("Transport"),
              trailing: const Text("₹ 800"),
            ),
            ListTile(
              leading: const Icon(Icons.shopping_cart, color: Colors.purple),
              title: const Text("Shopping"),
              trailing: const Text("₹ 2,000"),
            ),

            const Divider(height: 30),

            // 🎯 Savings Goal Progress
            const Text(
              "Savings Goal Progress",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 10),
            const LinearProgressIndicator(
              value: 0.6,
              color: Colors.teal,
              backgroundColor: Colors.tealAccent,
              minHeight: 8,
            ),
            const SizedBox(height: 5),
            const Text("60% of your ₹20,000 goal achieved"),

            const Divider(height: 30),

            // 💸 Budget Status
            const Text(
              "Budget Status",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text("Total Budget: ₹10,000"),
                Text("Spent: ₹4,500"),
              ],
            ),
            const SizedBox(height: 10),
            const LinearProgressIndicator(
              value: 0.45,
              color: Colors.orange,
              backgroundColor: Colors.orangeAccent,
              minHeight: 8,
            ),

            const Divider(height: 30),

            // 🧾 Recent Transactions
            const Text(
              "Recent Transactions",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 10),
            ListTile(
              leading: const Icon(Icons.shopping_bag, color: Colors.purple),
              title: const Text("Groceries"),
              subtitle: const Text("Oct 19"),
              trailing: const Text("₹ 500"),
            ),
            ListTile(
              leading: const Icon(Icons.local_cafe, color: Colors.brown),
              title: const Text("Cafe Coffee Day"),
              subtitle: const Text("Oct 18"),
              trailing: const Text("₹ 250"),
            ),
            ListTile(
              leading: const Icon(Icons.receipt_long, color: Colors.green),
              title: const Text("Electricity Bill"),
              subtitle: const Text("Oct 17"),
              trailing: const Text("₹ 1,800"),
            ),
          ],
        ),
      ),
    );
  }
}