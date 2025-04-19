const mongoose = require("mongoose");

const ShippingSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    status: { type: String, enum: ["processing", "shipped", "delivered"], default: "processing" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Shipping", ShippingSchema);
