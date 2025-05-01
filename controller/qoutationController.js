const Quotation = require("../models/qoutation"); // check spelling: should be "quotation"?
const { sendResponse } = require("../helper/responseHelper");

exports.getAllQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().populate("client products.product shippingDetails");
        return sendResponse(res, "success", 200, quotations, "Quotations retrieved successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};

exports.createQuotation = async (req, res) => {
    try {
        const quotation = new Quotation(req.body);
        await quotation.save();
        return sendResponse(res, "success", 201, quotation, "Quotation created successfully");
    } catch (err) {
        return sendResponse(res, "error", 400, null, err.message);
    }
};

exports.updateQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!quotation) return sendResponse(res, "error", 404, null, "Quotation not found");
        return sendResponse(res, "success", 200, quotation, "Quotation updated successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};

exports.deleteQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findByIdAndDelete(req.params.id);
        if (!quotation) return sendResponse(res, "error", 404, null, "Quotation not found");
        return sendResponse(res, "success", 200, quotation, "Quotation deleted successfully");
    } catch (err) {
        return sendResponse(res, "error", 500, null, err.message);
    }
};
