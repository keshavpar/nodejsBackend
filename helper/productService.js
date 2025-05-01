// services/productService.js
const Product = require("../models/product");

// Extract S3 keys (just the filename, not the full URL) from imageUrl
const getImageKeysForProduct = async (productId) => {
  const product = await Product.findById(productId).lean();

  if (!product || !product.imageUrl) return [];

  // Extract key from full S3 URL, assuming it's in the format: https://ld23.s3.amazonaws.com/<key>
  const url = new URL(product.imageUrl);
  const key = decodeURIComponent(url.pathname.slice(1)); // remove leading '/'
  
  return [key];
};

module.exports = {
  getImageKeysForProduct,
};
