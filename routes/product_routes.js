const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct); // ✅ Update
router.delete("/:id", productController.deleteProduct); // ✅ Delete
// ✅ New route to get signed image URL
router.get("/signed-url", productController.getSignedImageUrl);

module.exports = router;
