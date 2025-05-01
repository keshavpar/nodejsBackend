const Shipping = require("../models/shipping");
const { sendResponse } = require("../helper/responseHelper");

exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipping.find().populate("order");
        return sendResponse(res, "success", 200, shipments, "Shipments retrieved successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};

exports.createShipping = async (req, res) => {
    try {
        const shipping = new Shipping(req.body);
        await shipping.save();
        return sendResponse(res, "success", 201, shipping, "Shipping entry created successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};

exports.updateShipping = async (req, res) => {
    try {
        const shipping = await Shipping.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!shipping) return sendResponse(res, "error", 404, null, "Shipping entry not found");
        return sendResponse(res, "success", 200, shipping, "Shipping updated successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};

exports.deleteShipping = async (req, res) => {
    try {
        const shipping = await Shipping.findByIdAndDelete(req.params.id);
        if (!shipping) return sendResponse(res, "error", 404, null, "Shipping entry not found");
        return sendResponse(res, "success", 200, shipping, "Shipping deleted successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};
