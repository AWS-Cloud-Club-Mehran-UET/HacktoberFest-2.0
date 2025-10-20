import 'package:flutter/material.dart';
import 'add_transaction_screen.dart';

class TransactionScreen extends StatefulWidget {
  const TransactionScreen({super.key});

  @override
  State<TransactionScreen> createState() => _TransactionScreenState();
}

class _TransactionScreenState extends State<TransactionScreen> {
  List<Map<String, dynamic>> transactions = [];

  void _addTransaction(Map<String, dynamic> newTx) {
    setState(() => transactions.add(newTx));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Transactions')),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddTransactionScreen()),
          );
          if (result != null) _addTransaction(result);
        },
        child: const Icon(Icons.add),
      ),
      body: transactions.isEmpty
          ? const Center(child: Text("No transactions yet."))
          : ListView.builder(
              itemCount: transactions.length,
              itemBuilder: (context, index) {
                final tx = transactions[index];
                return ListTile(
                  leading: Icon(
                    Icons.monetization_on,
                    color: Colors.teal.shade700,
                  ),
                  title: Text(tx['title']),
                  subtitle: Text(tx['category']),
                  trailing: Text("₹ ${tx['amount']}"),
                );
              },
            ),
    );
  }
}