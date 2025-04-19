const express = require("express");
const { getAllShipments, createShipping } = require("../controller/shippingController");
const router = express.Router();

router.get("/", getAllShipments);
router.post("/", createShipping);

module.exports = router;
