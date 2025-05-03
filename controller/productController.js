const Product = require("../models/product");
const { sendResponse } = require("../helper/responseHelper");
// Import S3 client
const s3 = require("./../utilities/aws_config");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
      const products = await Product.find().populate("category");
      return sendResponse(res, "success", 200, products, "Products retrieved successfully");
  } catch (err) {
      console.error("Error fetching products:", err.message);
      return sendResponse(res, "error", 500, null, "Failed to retrieve products");
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
exports.getSignedUrlsForImages = async (req, res) => {
  try {
    if (!s3 || typeof s3.getSignedUrl !== "function") {
      throw new Error("S3 object not properly initialized");
    }

    const { imageKeys } = req.body;

    if (!Array.isArray(imageKeys) || imageKeys.length === 0) {
      return sendResponse(res, "error", 400, null, "Missing or invalid 'imageKeys' array in request body");
    }

    const signedUrls = imageKeys.map((key) => {
      if (typeof key !== "string" || !key.trim()) {
        throw new Error(`Invalid image key: ${key}`);
      }

      return s3.getSignedUrl("getObject", {
        Bucket: "ld23", // Replace with your actual bucket name or use a config variable
        Key: key,
        Expires: 60 * 5, // 5 minutes expiry
      });
    });

    return sendResponse(res, "success", 200, signedUrls, "Signed URLs generated successfully");
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
