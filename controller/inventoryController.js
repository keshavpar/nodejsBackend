const Inventory = require("../models/inventory");

exports.getAllInventoryLogs = async (req, res) => {
    try {
        const inventoryLogs = await Inventory.find().populate("product");
        res.json(inventoryLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addInventory = async (req, res) => {
    try {
        const inventory = new Inventory(req.body);
        await inventory.save();
        res.status(201).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
