const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantityAdded: { type: Number, required: true },
    dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inventory", InventorySchema);
