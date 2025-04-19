const express = require("express");
const { getAllInventoryLogs, addInventory } = require("../controllers/inventoryController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getAllInventoryLogs);
router.post("/", verifyToken, isAdmin, addInventory); // Only admin can add inventory

module.exports = router;
