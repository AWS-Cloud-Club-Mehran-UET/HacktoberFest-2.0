import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'product_screen.dart';
import 'sales_screen.dart';
import 'reports_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int totalProducts = 0;
  int totalSales = 0;

  final String productApi = 'http://localhost:5000/api/products';
  final String salesApi = 'http://localhost:5000/api/sales';

  @override
  void initState() {
    super.initState();
    fetchSummary();
  }

  Future<void> fetchSummary() async {
    try {
      // Fetch products count
      final productResponse = await http.get(Uri.parse(productApi));
      if (productResponse.statusCode == 200) {
        final List products = json.decode(productResponse.body);
        setState(() {
          totalProducts = products.length;
        });
      }

      // Fetch sales count
      final salesResponse = await http.get(Uri.parse(salesApi));
      if (salesResponse.statusCode == 200) {
        final List sales = json.decode(salesResponse.body);
        setState(() {
          totalSales = sales.length;
        });
      }
    } catch (e) {
      print('Error fetching summary: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ShopEase Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Card(
              child: ListTile(
                title: const Text('Total Products'),
                trailing: Text(totalProducts.toString()),
              ),
            ),
            Card(
              child: ListTile(
                title: const Text('Total Sales'),
                trailing: Text(totalSales.toString()),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              child: const Text('Manage Products'),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ProductScreen()),
              ),
            ),
            ElevatedButton(
              child: const Text('Record Sales'),
              onPressed: () => Navigator.push(
                context,
                // ✅ Make sure SalesScreen class exists and has a const constructor
                MaterialPageRoute(builder: (_) => const SalesScreen()),
              ),
            ),
            ElevatedButton(
              child: const Text('Reports'),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ReportsScreen()),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
