const mongoose = require("mongoose");

const PurchaseOrderSchema = new mongoose.Schema({
  vendor:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity:  { type: Number, required: true },
      rate:      { type: Number }, // Rate at which you are purchasing
    }
  ],
  cgst:           { type: Number, default: 0 },
  sgst:           { type: Number, default: 0 },
  igst:           { type: Number, default: 0 },
  ugst:           {type:Number, default: 0},
  totalAmount:    { type: Number, required: true },

  advancePaid:    { type: Number, default: 0 },
  modeOfPayment:  { type: String, enum: ["cash", "bank", "upi", "cheque", "credit"], default: "cash" },

  shippingDetails:{ type: mongoose.Schema.Types.ObjectId, ref: "Shipping", required: false },
  expectedDelivery: { type: Date },

  status:         { type: String, enum: ["pending", "received", "cancelled"], default: "pending" },
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
