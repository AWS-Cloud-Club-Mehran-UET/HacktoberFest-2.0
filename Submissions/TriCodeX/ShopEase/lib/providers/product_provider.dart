
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ProductProvider with ChangeNotifier {
  final String baseUrl = 'http://localhost:5000/api/products'; // your backend URL
  List<Product> _products = [];

  List<Product> get products => _products;

  // Fetch products from backend
  Future<void> fetchProducts() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      final List data = json.decode(response.body);
      _products = data.map((e) => Product.fromJson(e)).toList();
      notifyListeners();
    }
  }

  // Add product
  Future<void> addProduct(Product product) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(product.toJson()),
    );
    if (response.statusCode == 201) {
      _products.add(product);
      notifyListeners();
    }
  }

  // Update product
  Future<void> updateProduct(Product product) async {
    final response = await http.put(
      Uri.parse('$baseUrl/${product.id}'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(product.toJson()),
    );
    if (response.statusCode == 200) {
      final index = _products.indexWhere((p) => p.id == product.id);
      if (index >= 0) {
        _products[index] = product;
        notifyListeners();
      }
    }
  }

  // Delete product
  Future<void> deleteProduct(String id) async {
    final response = await http.delete(Uri.parse('$baseUrl/$id'));
    if (response.statusCode == 200) {
      _products.removeWhere((p) => p.id == id);
      notifyListeners();
    }
  }
}
