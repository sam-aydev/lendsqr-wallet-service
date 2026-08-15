"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const AppError_1 = require("../utils/AppError");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError_1.AppError("Unauthorized: No token provided", 401));
    }
    const token = authHeader.split(" ")[1].trim();
    if (!token) {
        return next(new AppError_1.AppError("Unauthorized: Invalid token format", 401));
    }
    // Attach the user ID to the request object
    req.user = { id: token };
    next();
};
exports.authenticate = authenticate;
