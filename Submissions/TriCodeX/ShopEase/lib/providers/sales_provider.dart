

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/sale.dart';

class SalesProvider with ChangeNotifier {
  final String baseUrl = 'http://localhost:5000/api/sales';
  List<Sale> _sales = [];

  List<Sale> get sales => _sales;

  double get totalRevenue => _sales.fold(0, (sum, item) => sum + item.totalPrice);

  // Fetch sales
  Future<void> fetchSales() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      _sales = data.map((e) => Sale.fromJson(e)).toList();
      notifyListeners();
    }
  }

  // Add sale
  Future<void> addSale(Sale sale) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(sale.toJson()),
    );
    if (response.statusCode == 201) {
      _sales.add(sale);
      notifyListeners();
    }
  }
}
