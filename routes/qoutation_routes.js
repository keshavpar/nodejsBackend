const express = require("express");
const router = express.Router();
const quotationController = require("../controller/qoutationController");

router.get("/", quotationController.getAllQuotations);
router.post("/", quotationController.createQuotation);

module.exports = router;
