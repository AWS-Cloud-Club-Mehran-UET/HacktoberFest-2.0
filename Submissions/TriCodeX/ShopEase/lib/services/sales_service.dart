import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/sale.dart';

class SalesService {
  final String baseUrl = 'http://localhost:5000/api/sales';

  Future<List<Sale>> fetchSales() async {
    final response = await http.get(Uri.parse(baseUrl));
    final List data = jsonDecode(response.body);
    return data.map((json) => Sale.fromJson(json)).toList();
  }

  Future<Sale> addSale(Sale sale) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(sale.toJson()),
    );
    return Sale.fromJson(jsonDecode(response.body)['sale']);
  }

  Future<double> getTotalRevenue() async {
    final response = await http.get(Uri.parse('$baseUrl/total'));
    final data = jsonDecode(response.body);
    return data['totalRevenue'].toDouble();
  }
}
