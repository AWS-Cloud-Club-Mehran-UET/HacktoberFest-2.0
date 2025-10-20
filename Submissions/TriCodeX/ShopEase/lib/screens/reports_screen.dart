import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/sale.dart';
import 'package:http/http.dart' as http;

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  List<Sale> sales = [];
  double totalRevenue = 0;
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
        final List data = json.decode(response.body);

        List<Sale> fetchedSales = data.map((item) => Sale.fromJson(item)).toList();

        double revenue = fetchedSales.fold(0, (sum, sale) => sum + sale.totalPrice);

        setState(() {
          sales = fetchedSales;
          totalRevenue = revenue;
          isLoading = false;
        });
      } else {
        print('Failed to load sales');
        setState(() => isLoading = false);
      }
    } catch (e) {
      print('Error fetching sales: $e');
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reports')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Text(
                    'Total Revenue: Rs. ${totalRevenue.toStringAsFixed(2)}',
                    style: const TextStyle(
                        fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const Divider(),
                  Expanded(
                    child: sales.isEmpty
                        ? const Center(child: Text('No sales yet'))
                        : ListView.builder(
                            itemCount: sales.length,
                            itemBuilder: (_, i) {
                              final sale = sales[i];
                              return ListTile(
                                title: Text(sale.productName),
                                subtitle: Text(
                                    'Qty: ${sale.quantitySold} | Date: ${sale.date.toLocal()}'),
                                trailing: Text(
                                    'Rs. ${sale.totalPrice.toStringAsFixed(2)}'),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
    );
  }
}