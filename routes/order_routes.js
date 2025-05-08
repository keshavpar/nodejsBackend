const express = require("express");
const orderController = require("../controller/orderController");
const router = express.Router();


router.get("/", orderController.getAllOrders);
router.post("/", orderController.createOrder);
// router.put("/:id", orderController.updateClient); // ✅ Update
// router.delete("/:id", orderController.deleteClient); 
module.exports = router;
