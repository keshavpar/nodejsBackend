const express = require("express");
const { getAllPayments, processPayment } = require("../controller/paymentController");
const router = express.Router();

router.get("/", getAllPayments);
router.post("/", processPayment);

module.exports = router;
