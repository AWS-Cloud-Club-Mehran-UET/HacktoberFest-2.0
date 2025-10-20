import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ProductService {
  final String baseUrl = 'http://localhost:5000/api/products';

  Future<List<Product>> fetchProducts() async {
    final response = await http.get(Uri.parse(baseUrl));
    final List data = jsonDecode(response.body);
    return data.map((json) => Product.fromJson(json)).toList();
  }

  Future<Product> addProduct(Product product) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(product.toJson()),
    );
    return Product.fromJson(jsonDecode(response.body)['product']);
  }

  Future<Product> updateProduct(Product product) async {
    final response = await http.put(
      Uri.parse('$baseUrl/${product.id}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(product.toJson()),
    );
    return Product.fromJson(jsonDecode(response.body)['product']);
  }

  Future<void> deleteProduct(String id) async {
    await http.delete(Uri.parse('$baseUrl/$id'));
  }
}
