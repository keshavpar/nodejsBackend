const express = require("express");
const router = express.Router();
const clientController = require("../controller/client_controller");

// Create client
router.post("/create", clientController.createClient);

// Get all clients
router.get("/", clientController.getAllClients);
router.put("/:id", clientController.updateClient); // ✅ Update
router.delete("/:id", clientController.deleteClient); // ✅ Delete

module.exports = router;
