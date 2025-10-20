const express = require('express');
const router = express.Router();
const Sale = require('../models/sale'); // ensure exact file name

// GET all sales
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find().populate('productId', 'name sku price');
        res.json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single sale by ID
router.get('/:id', async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate('productId', 'name sku price');
        if (!sale) return res.status(404).json({ message: 'Sale not found' });
        res.json(sale);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new sale
router.post('/', async (req, res) => {
    const { productId, quantitySold, totalPrice } = req.body;

    const sale = new Sale({
        productId,
        quantitySold,
        totalPrice
    });

    try {
        const newSale = await sale.save();
        res.status(201).json(newSale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a sale
router.delete('/:id', async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        await sale.deleteOne(); // updated
        res.json({ message: 'Sale deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;