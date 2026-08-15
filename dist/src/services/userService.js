"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserAccount = void 0;
const database_1 = __importDefault(require("../database"));
const AppError_1 = require("../utils/AppError");
const adjutorService_1 = require("./adjutorService");
const uuid_1 = require("uuid");
const createUserAccount = async (firstName, lastName, email) => {
    const existingUser = await (0, database_1.default)("users").where({ email }).first();
    if (existingUser) {
        throw new AppError_1.AppError("Email is already registered!", 400);
    }
    await (0, adjutorService_1.checkKarmaBlacklist)(email);
    const result = await database_1.default.transaction(async (trx) => {
        const userId = (0, uuid_1.v4)();
        const walletId = (0, uuid_1.v4)();
        await trx("users").insert({
            id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email
        });
        await trx("wallets").insert({
            id: walletId,
            user_id: userId,
            balance: 0.00
        });
        return {
            user: { id: userId, firstName, lastName, email },
            wallet: { id: walletId, balance: 0.00 }
        };
    });
    return result;
};
exports.createUserAccount = createUserAccount;
