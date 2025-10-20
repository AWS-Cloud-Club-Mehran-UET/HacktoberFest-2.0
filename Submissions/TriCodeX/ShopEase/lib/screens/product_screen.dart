import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ProductScreen extends StatefulWidget {
  const ProductScreen({super.key});

  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  final _formKey = GlobalKey<FormState>();
  List<Product> products = [];

  // Form fields
  String _name = '';
  String _sku = '';
  String _category = '';
  double _price = 0;
  int _quantity = 0;
  String? _editingId;

  final String baseUrl = 'http://localhost:5000/api/products'; // backend API

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    try {
      final response = await http.get(Uri.parse(baseUrl));
      if (response.statusCode == 200) {
        final List data = json.decode(response.body);
        setState(() {
          products = data.map((json) => Product.fromJson(json)).toList();
        });
      } else {
        print('Failed to fetch products: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching products: $e');
    }
  }

  Future<void> saveProduct() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    final productData = {
      'name': _name,
      'sku': _sku,
      'category': _category,
      'price': _price,
      'quantity': _quantity,
    };

    try {
      if (_editingId == null) {
        // Create new product
        final response = await http.post(
          Uri.parse(baseUrl),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(productData),
        );
        if (response.statusCode == 201) {
          fetchProducts();
        }
      } else {
        // Update product
        final response = await http.put(
          Uri.parse('$baseUrl/$_editingId'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(productData),
        );
        if (response.statusCode == 200) {
          fetchProducts();
        }
      }
    } catch (e) {
      print('Error saving product: $e');
    }

    Navigator.of(context).pop();
  }

  Future<void> deleteProduct(String id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/$id'));
      if (response.statusCode == 200) {
        fetchProducts();
      }
    } catch (e) {
      print('Error deleting product: $e');
    }
  }

  void _showProductForm([Product? product]) {
    if (product != null) {
      _editingId = product.id;
      _name = product.name;
      _sku = product.sku;
      _category = product.category;
      _price = product.price;
      _quantity = product.quantity;
    } else {
      _editingId = null;
      _name = '';
      _sku = '';
      _category = '';
      _price = 0;
      _quantity = 0;
    }

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(product == null ? 'Add Product' : 'Edit Product'),
        content: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              children: [
                TextFormField(
                  initialValue: _name,
                  decoration: const InputDecoration(labelText: 'Name'),
                  validator: (v) => v!.isEmpty ? 'Enter name' : null,
                  onSaved: (v) => _name = v!,
                ),
                TextFormField(
                  initialValue: _sku,
                  decoration: const InputDecoration(labelText: 'SKU'),
                  validator: (v) => v!.isEmpty ? 'Enter SKU' : null,
                  onSaved: (v) => _sku = v!,
                ),
                TextFormField(
                  initialValue: _category,
                  decoration: const InputDecoration(labelText: 'Category'),
                  onSaved: (v) => _category = v!,
                ),
                TextFormField(
                  initialValue: _price != 0 ? _price.toString() : '',
                  decoration: const InputDecoration(labelText: 'Price'),
                  keyboardType: TextInputType.number,
                  validator: (v) => v!.isEmpty ? 'Enter price' : null,
                  onSaved: (v) => _price = double.parse(v!),
                ),
                TextFormField(
                  initialValue: _quantity != 0 ? _quantity.toString() : '',
                  decoration: const InputDecoration(labelText: 'Quantity'),
                  keyboardType: TextInputType.number,
                  validator: (v) => v!.isEmpty ? 'Enter quantity' : null,
                  onSaved: (v) => _quantity = int.parse(v!),
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: saveProduct,
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Products')),
      body: products.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: products.length,
              itemBuilder: (_, i) {
                final product = products[i];
                return ListTile(
                  title: Text(product.name),
                  subtitle: Text('SKU: ${product.sku} | Qty: ${product.quantity}'),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () => _showProductForm(product),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () => deleteProduct(product.id),
                      ),
                    ],
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () => _showProductForm(),
      ),
    );
  }
}