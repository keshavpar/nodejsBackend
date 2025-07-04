const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      rate:{
        type: Number,
        
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  cgst: {
    type: Number,default: 0 
  },
  sgst: {
    type: Number,
    default: 0 
  },
  igst: {
    type: Number,default: 0 
  },
  ugst:{
    type: Number,default: 0 
  },
  advancePayment: {
    type: Number,default: 0 
  },
  modeOfPayment: {
    type: String // you can also set enum if you want: ['cash', 'card', 'upi', etc.]
  },
  shippingDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingDetail"
  },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", OrderSchema);
