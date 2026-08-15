"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = void 0;
const userService_1 = require("../services/userService");
const createAccount = async (req, res, next) => {
    try {
        const { first_name, last_name, email } = req.body;
        // Basic validation
        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'first_name, last_name, and email are required fields'
            });
        }
        const data = await (0, userService_1.createUserAccount)(first_name, last_name, email);
        res.status(201).json({
            status: 'success',
            message: 'Account created successfully',
            data
        });
    }
    catch (error) {
        // Pass the error to the global error handler in app.ts
        next(error);
    }
};
exports.createAccount = createAccount;
