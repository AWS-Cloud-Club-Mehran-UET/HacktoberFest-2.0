import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SalesScreen extends StatefulWidget {
  const SalesScreen({super.key}); // ✅ const constructor

  @override
  State<SalesScreen> createState() => _SalesScreenState();
}

class _SalesScreenState extends State<SalesScreen> {
  List<dynamic> sales = [];
  bool isLoading = true;
  final String salesApi = 'http://localhost:5000/api/sales';

  @override
  void initState() {
    super.initState();
    fetchSales();
  }

  Future<void> fetchSales() async {
    try {
      final response = await http.get(Uri.parse(salesApi));
      if (response.statusCode == 200) {
        setState(() {
          sales = json.decode(response.body);
          isLoading = false;
        });
      } else {
        setState(() => isLoading = false);
      }
    } catch (e) {
      setState(() => isLoading = false);
      print('Error fetching sales: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sales')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : sales.isEmpty
              ? const Center(child: Text('No sales found'))
              : ListView.builder(
                  itemCount: sales.length,
                  itemBuilder: (_, index) {
                    final sale = sales[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      child: ListTile(
                        title: Text(sale['productName'] ?? 'Unknown Product'),
                        subtitle: Text(
                            'Qty: ${sale['quantitySold'] ?? 0} | Date: ${sale['date'] != null ? DateTime.parse(sale['date']).toLocal() : 'N/A'}'),
                        trailing: Text(
                            'Rs. ${sale['totalPrice']?.toStringAsFixed(2) ?? '0.00'}'),
                      ),
                    );
                  },
                ),
    );
  }
}