const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, unique: true, required: true },
    phone:    { type: String },
    role:     { type: String, enum: ["admin", "client"], default: "client" },
    address:  { type: String },
    landmark: { type: String },
    pincode:  { type: String },
    createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
