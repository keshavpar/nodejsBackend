const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hsnCode: { type: String, required: true }, // Added HSN Code
    description: { type: String },
    category: { type: String, required: true }, // Changed to String as sent from Flutter
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }, // Renamed stockQuantity to match frontend
    type: { type: String, required: true }, // Product type
    imageUrl: { type: String }, // Can store the uploaded image URL
    addTax: { type: Boolean, default: false }, // Smart Tax selection
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
