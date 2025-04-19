const Payment = require("../models/payment");
const { sendResponse } = require("../helper/responseHelper");

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate("order");
        sendResponse(res, "success", 200, payments, "Payments retrieved successfully");
    } catch (err) {
        sendResponse(res, "error", 500, null, err.message);
    }
};

exports.processPayment = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        sendResponse(res, "success", 201, payment, "Payment processed successfully");
    } catch (err) {
        sendResponse(res, "error", 500, null, err.message);
    }
};
