class Product {
  final String id;
  final String name;
  final String sku;
  final String category;
  final double price;
  final int quantity;

  Product({
    required this.id,
    required this.name,
    required this.sku,
    required this.category,
    required this.price,
    required this.quantity,
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json['_id'],
        name: json['name'],
        sku: json['sku'],
        category: json['category'],
        price: json['price'].toDouble(),
        quantity: json['quantity'],
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        'sku': sku,
        'category': category,
        'price': price,
        'quantity': quantity,
      };
}
