const Product = require("../models/product");
const { sendResponse } = require("../helper/responseHelper");
// Import S3 client
const s3 = require("./../utilities/aws_config");
// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        sendResponse(res, "success", 200, products, "Products retrieved successfully");
    } catch (err) {
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        sendResponse(res, "success", 201, product, "Product created successfully");
    } catch (err) {
        sendResponse(res, "error", 500, null, err.message);
    }
};

// ✅ Update a product by ID
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return sendResponse(res, "error", 404, null, "Product not found");
        }

        sendResponse(res, "success", 200, updatedProduct, "Product updated successfully");
    } catch (err) {
        sendResponse(res, "error", 500, null, err.message);
    }
};


// controllers/awsController.js


exports.getSignedImageUrl = async (req, res) => {
    try {
      if (!s3 || typeof s3.getSignedUrl !== "function") {
        throw new Error("S3 object not properly initialized");
      }
  
      const { key } = req.query;
  
      if (!key) {
        return sendResponse(res, "error", 400, null, "Missing 'key' query parameter");
      }
  
      const params = {
        Bucket: "ld23",
        Key: key,
        Expires: 60 * 5,
      };
  
      const url = s3.getSignedUrl("getObject", params);
  
      return sendResponse(res, "success", 200, { url }, "Signed URL generated successfully");
    } catch (err) {
      console.error("AWS Signed URL Error:", err);
      return sendResponse(res, "error", 500, null, err.message);
    }
  };

// ✅ Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return sendResponse(res, "error", 404, null, "Product not found");
        }

        sendResponse(res, "success", 200, deletedProduct, "Product deleted successfully");
    } catch (err) {
        sendResponse(res, "error", 500, null, err.message);
    }
};
