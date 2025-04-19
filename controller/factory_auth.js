const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { sendResponse } = require("../helper/responseHelper");
const { generateTokens, verifyRefreshToken } = require("../middleware/auth_middleware");

exports.registerUser = async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;

    if (!username || !email || !password || !passwordConfirm) {
        return sendResponse(res, 0, 400, null, "All fields are required");
    }
    if (password !== passwordConfirm) {
        return sendResponse(res, 0, 400, null, "Passwords do not match");
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() }).select("+refreshToken");
        if (existingUser) {
            return sendResponse(res, 0, 400, null, "Email is already in use");
        }

        // Create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Generate tokens for the new user
        const { authToken, refreshToken } = generateTokens(newUser._id);

        // Save the refresh token directly (no hashing)
        newUser.refreshToken = refreshToken;
        await newUser.save();

        // Hide sensitive information
        newUser.password = undefined;
        newUser.refreshToken = undefined;

        return sendResponse(res, 1, 201, { user: newUser, authToken, refreshToken }, "User registered successfully");
    } catch (error) {
        console.error("Registration Error:", error);
        return sendResponse(res, 0, 500, null, "Server error");
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendResponse(res, 0, 400, null, "Email and password are required");
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password +refreshToken");
        if (!user) {
            return sendResponse(res, 0, 401, null, "Invalid credentials");
        }

        // Validate the password
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return sendResponse(res, 0, 401, null, "Invalid credentials");
        }

        let authToken, refreshToken;

        // Check if the existing refresh token is valid
        if (user.refreshToken) {
            const { valid, decoded } = await verifyRefreshToken(user.refreshToken);
            if (valid) {
                // Reuse the existing refresh token and generate a new auth token
                authToken = generateTokens(decoded.userId).authToken;
                refreshToken = user.refreshToken; // Use the existing refresh token
            }
        }

        if (!authToken || !refreshToken) {
            // Generate new tokens if no valid tokens exist
            const tokens = generateTokens(user._id);
            authToken = tokens.authToken;
            refreshToken = tokens.refreshToken;

            // Update the user's refresh token in the database
            user.refreshToken = refreshToken;
            await user.save();
        }

        // Hide sensitive information
        user.password = undefined;
        user.refreshToken = undefined;

        return sendResponse(res, 1, 200, { user, authToken, refreshToken }, "Login successful");
    } catch (error) {
        console.error("Login Error:", error);
        return sendResponse(res, 0, 500, null, "Server error");
    }
};
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        console.error("No refresh token provided");
        return sendResponse(res, 0, 400, null, "Refresh token is required");
    }

    try {
        // Verify the provided refresh token
        const { valid, decoded } = await verifyRefreshToken(refreshToken);
        if (!valid || !decoded) {
            console.error("Refresh token verification failed: invalid or expired");
            return sendResponse(res, 0, 403, null, "Invalid or expired refresh token");
        }

        // Retrieve the user associated with the refresh token
        const user = await User.findById(decoded.userId).select("+refreshToken");
        if (!user) {
            console.error("User not found for refresh token");
            return sendResponse(res, 0, 403, null, "Invalid refresh token");
        }

        // Generate new tokens
        const { authToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        // Update the user's refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save();
        var username= user.username;
        var id = user._id;  
        var profile=user.profilepicture;
        // Return the new tokens
        return sendResponse(res, 1, 200, { authToken, refreshToken: newRefreshToken,username,profile,id }, "Tokens refreshed successfully");
    } catch (error) {
        console.error("Error refreshing token:", error.message);
        return sendResponse(res, 0, 500, null, "Server error");
    }
};

// Controller function to fetch the user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -refreshToken");
        if (!user) {
            return sendResponse(res, 0, 404, null, "User not found");
        }

        return sendResponse(res, 1, 200, user, "User profile fetched successfully");
    } catch (error) {
        console.error("Get Profile Error:", error);
        return sendResponse(res, 0, 500, null, "Server error");
    }
};

// Controller function to update user profile
exports.updateUserProfile = async (req, res) => {
    const updates = req.body;

    // Restrict sensitive fields
    if (updates.password || updates.refreshToken) {
        return sendResponse(res, 0, 400, null, "Invalid update fields");
    }

    try {
        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select("-password -refreshToken");
        if (!user) {
            return sendResponse(res, 0, 404, null, "User not found");
        }

        return sendResponse(res, 1, 200, user, "User profile updated successfully");
    } catch (error) {
        console.error("Update Profile Error:", error);
        return sendResponse(res, 0, 500, null, "Server error");
    }
}; 