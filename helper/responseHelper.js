// responseHelper.js
exports.sendResponse = (res, status, code, data, message) => {
    return res.status(code).json({
        status: status,
        code: code,
        data: data,
        message: message
    });
};
