const Order = require("../models/order");
const Product = require("../models/product");
const { sendResponse } = require("../helper/responseHelper");// Adjust the path if needed

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("client products.product");
    return sendResponse(res, "success", 200, orders, "Orders fetched successfully");
  } catch (err) {
    return sendResponse(res, "error", 500, null, err.message);
  }
};

exports.createOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const orderData = req.body;
    const products = orderData.products;

    for (const item of products) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return sendResponse(res, "error", 404, null, `Product not found: ${item.product}`);
      }

      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return sendResponse(
          res,
          "error",
          400,
          null,
          `Insufficient quantity for product "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`
        );
      }

      product.quantity -= item.quantity;
      await product.save({ session });
    }

    const order = new Order(orderData);
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return sendResponse(res, "success", 201, order, "Order created successfully");

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return sendResponse(res, "error", 500, null, err.message);
  }
};

exports.updateOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const orderId = req.params.id;
    const newOrderData = req.body;

    const oldOrder = await Order.findById(orderId).session(session);
    if (!oldOrder) {
      await session.abortTransaction();
      session.endSession();
      return sendResponse(res, "error", 404, null, "Order not found");
    }

    // Restore stock
    for (const item of oldOrder.products) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        product.quantity += item.quantity;
        await product.save({ session });
      }
    }

    // Deduct new stock
    for (const item of newOrderData.products) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return sendResponse(res, "error", 404, null, `Product not found: ${item.product}`);
      }

      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return sendResponse(
          res,
          "error",
          400,
          null,
          `Insufficient quantity for product "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`
        );
      }

      product.quantity -= item.quantity;
      await product.save({ session });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, newOrderData, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return sendResponse(res, "success", 200, updatedOrder, "Order updated successfully");

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return sendResponse(res, "error", 500, null, err.message);
  }
};

exports.deleteOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return sendResponse(res, "error", 404, null, "Order not found");
    }

    for (const item of order.products) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        product.quantity += item.quantity;
        await product.save({ session });
      }
    }

    await Order.findByIdAndDelete(req.params.id).session(session);

    await session.commitTransaction();
    session.endSession();

    return sendResponse(res, "success", 200, null, "Order deleted and stock restored");

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return sendResponse(res, "error", 500, null, err.message);
  }
};
