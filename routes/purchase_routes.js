const express = require("express");
const router = express.Router();
const purchaseOrderController = require("../controller/purchaseController");

router.get("/", purchaseOrderController.getAllPurchaseOrders);
router.post("/", purchaseOrderController.createPurchaseOrder);
router.put("/:id", purchaseOrderController.updatePurchaseOrder); // ✅ Update
router.delete("/:id",purchaseOrderController.deletePurchaseOrder); // ✅ Delete


module.exports = router;
