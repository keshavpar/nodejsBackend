const User = require("../models/user");
const { sendResponse } = require("../helper/responseHelper");

// Create a new client
exports.createClient = async (req, res) => {
    try {
        const clientData = { ...req.body, role: "client" }; // force role = client
        const client = new User(clientData);
        await client.save();
        sendResponse(res, "success", 201, client, "Client created successfully");
    } catch (err) {
        sendResponse(res, "error", 500, null, err.message);
    }
};

// Get all clients
exports.getAllClients = async (req, res) => {
    try {
        const clients = await User.find({ role: "client" });
        sendResponse(res, "success", 200, clients, "Clients retrieved successfully");
    } catch (err) {
        sendResponse(res, "error", 500, null, err.message);
    }
};

// ✅ Update a product by ID
exports.updateClient = async (req, res) => {
    try {
        const clientId= req.params.id;
        const updatedClient = await User.findByIdAndUpdate(
            clientId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return sendResponse(res, "error", 404, null, "Client not found");
        }

        sendResponse(res, "success", 200, updatedClient, "Client updated successfully");
    } catch (err) {
        sendResponse(res, "error", 500, null, err.message);
    }
};


// ✅ Delete a product by ID
exports.deleteClient = async (req, res) => {
    try {
        const clientId = req.params.id;
        const deletedClient = await User.findByIdAndDelete(clientId);

        if (!deletedClient) {
            return sendResponse(res, "error", 404, null, "Client not found");
        }

        sendResponse(res, "success", 200, deletedClient, "Client deleted successfully");
    } catch (err) {
        sendResponse(res, "error", 500, null, err.message);
    }
};


