"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppError_1 = require("./utils/AppError");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const app = (0, express_1.default)();
// The middleware to parse incoming JSON payloads
app.use(express_1.default.json());
app.use("/api/users", userRoutes_1.default);
app.use("/api/wallets", walletRoutes_1.default);
app.get("/", (req, res) => {
    res
        .status(200)
        .json({ status: "success", message: "Lendsqr wallet API is running!" });
});
// The global error handling middleware
app.use((err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else {
        console.error("UNEXPECTED ERROR:", err);
    }
    res.status(statusCode).json({
        status: "error",
        message,
    });
});
exports.default = app;
