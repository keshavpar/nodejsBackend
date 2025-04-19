const Shipping = require("../models/shipping");

exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipping.find().populate("order");
        res.json(shipments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createShipping = async (req, res) => {
    try {
        const shipping = new Shipping(req.body);
        await shipping.save();
        res.status(201).json(shipping);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
