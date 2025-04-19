const express = require("express");
const router = express.Router();
const clientController = require("../controller/client_controller");

// Create client
router.post("/create", clientController.createClient);

// Get all clients
router.get("/", clientController.getAllClients);

module.exports = router;
