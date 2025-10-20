const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
});

// This line avoids the overwrite error:
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);