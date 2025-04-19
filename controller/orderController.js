const Order = require("../models/order");

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("client products.product");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
