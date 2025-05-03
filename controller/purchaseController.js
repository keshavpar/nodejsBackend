const PurchaseOrder = require("../models/purchase_order");
const { sendResponse } = require("../helper/responseHelper");

exports.getAllPurchaseOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrder.find()
           
        return sendResponse(res, "success", 200, orders, "Purchase orders retrieved successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};

exports.createPurchaseOrder = async (req, res) => {
    try {
        const order = new PurchaseOrder(req.body);
        await order.save();
        return sendResponse(res, "success", 201, order, "Purchase order created successfully");
    } catch (err) {
        return sendResponse(res, "error", 400, null, err.message);
    }
};

exports.updatePurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!order) return sendResponse(res, "error", 404, null, "Purchase order not found");
        return sendResponse(res, "success", 200, order, "Purchase order updated successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};

exports.deletePurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrder.findByIdAndDelete(req.params.id);
        if (!order) return sendResponse(res, "error", 404, null, "Purchase order not found");
        return sendResponse(res, "success", 200, order, "Purchase order deleted successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};
