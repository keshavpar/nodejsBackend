const express = require("express");
const https = require("https");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// Import Routes
const productRoutes = require("./routes/product_routes");
const orderRoutes = require("./routes/order_routes");
const clientRoutes = require("./routes/client_routes");
const paymentRoutes = require("./routes/payment_routes");
const shippingRoutes = require("./routes/shipping_routes");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// MongoDB Connection
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to the database"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Root Route (Check if API is working)
app.get("/", (req, res) => {
  res.json({ message: "🚀 E-Commerce API Working!" });
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/shipping", shippingRoutes);
// app.use("/api/users", userRoutes);

// HTTPS Server Setup
try {
  const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  };

  https.createServer(options, app).listen(4100, () => {
    console.log("🔒 HTTPS server is running on port 4100");
  });
} catch (error) {
  console.error("❌ HTTPS Server Error:", error.message);
}
