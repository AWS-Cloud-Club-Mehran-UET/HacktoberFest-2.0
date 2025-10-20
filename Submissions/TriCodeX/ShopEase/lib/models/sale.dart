class Sale {
  final String id;
  final String productId;
  final String productName;
  final int quantitySold;
  final double totalPrice;
  final DateTime date;

  Sale({
    required this.id,
    required this.productId,
    required this.productName,
    required this.quantitySold,
    required this.totalPrice,
    required this.date,
  });

  factory Sale.fromJson(Map<String, dynamic> json) => Sale(
        id: json['_id'],
        productId: json['productId'],
        productName: json['productName'],
        quantitySold: json['quantitySold'],
        totalPrice: json['totalPrice'].toDouble(),
        date: DateTime.parse(json['date']),
      );

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'productName': productName,
        'quantitySold': quantitySold,
        'totalPrice': totalPrice,
      };
}
