const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema({
  client:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity:  { type: Number, required: true },
      rate:      { type: Number }, // Rate offered in this quote
    }
  ],

  totalAmount:    { type: Number, required: true },

  validTill:      { type: Date },  // Quotation expiry
  notes:          { type: String },

  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model("Quotation", QuotationSchema);
