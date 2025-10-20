
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/product'); // lowercase
const Sale = require('./models/sale');       // lowercase
const productRoutes = require('./routes/productRoutes'); 
const salesRoutes = require('./routes/salesroutes'); // corrected path

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('🚀 Server is running successfully!');
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');

  // Seed dummy products
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log('Seeding dummy products...');
    await Product.insertMany([
      { name: 'Laptop', sku: 'LP1001', category: 'Electronics', price: 120000, quantity: 10 },
      { name: 'Mobile Phone', sku: 'MP2001', category: 'Electronics', price: 60000, quantity: 25 },
      { name: 'Headphones', sku: 'HD3001', category: 'Accessories', price: 5000, quantity: 50 },
    ]);
    console.log('Dummy products added!');
  }

  // Seed dummy sales
  const saleCount = await Sale.countDocuments();
  if (saleCount === 0) {
    console.log('Seeding dummy sales...');
    const products = await Product.find();
    await Sale.insertMany([
      { productId: products[0]._id, quantitySold: 2, totalPrice: products[0].price * 2, date: new Date() },
      { productId: products[1]._id, quantitySold: 1, totalPrice: products[1].price, date: new Date() },
    ]);
    console.log('Dummy sales added!');
  }

})
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
