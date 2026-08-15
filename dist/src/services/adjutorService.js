"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkKarmaBlacklist = void 0;
const axios_1 = __importDefault(require("axios"));
const AppError_1 = require("../utils/AppError");
const checkKarmaBlacklist = async (email) => {
    try {
        const response = await axios_1.default.get(`https://adjutor.lendsqr.com/v2/verification/karma/${email}`, {
            headers: {
                Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`,
            },
        });
        // Lendsqr Test Mode Handle: Allow bypassing so you can test your app locally
        if (response.data && response.data["mock-response"]) {
            console.log("Adjutor API is in Test Mode. Bypassing blacklist check.");
            return true;
        }
        // Live Mode Handle: If identity is actually found on the blacklist
        if (response.data && response.data.status === "success") {
            throw new AppError_1.AppError("Onboarding denied: User is blacklisted on Lendsqr Karma", 403);
        }
    }
    catch (error) {
        // If we threw the 403 AppError above, re-throw it so the controller catches it.
        if (error.statusCode === 403) {
            throw error;
        }
        // A 404 means the user is clean (NOT blacklisted), which is exactly what we want!
        if (error.response && error.response.status === 404) {
            return true;
        }
        // Catch-all for network issues
        console.error("Adjutor API Network Error:", error.response?.data || error.message);
        throw new AppError_1.AppError("Service temporarily unavailable while verifying identity", 502);
    }
};
exports.checkKarmaBlacklist = checkKarmaBlacklist;
