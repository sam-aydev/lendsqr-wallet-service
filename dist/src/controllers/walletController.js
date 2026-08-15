"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdraw = exports.transfer = exports.fund = void 0;
const walletService_1 = require("../services/walletService");
const fund = async (req, res, next) => {
    try {
        const userId = req.user.id; // Extracted from our auth middleware
        const { amount } = req.body;
        if (!amount || isNaN(amount)) {
            return res.status(400).json({
                status: 'error',
                message: 'A valid amount is required'
            });
        }
        const wallet = await (0, walletService_1.fundWallet)(userId, Number(amount));
        res.status(200).json({
            status: 'success',
            message: 'Wallet funded successfully',
            data: {
                balance: wallet.balance
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.fund = fund;
const transfer = async (req, res, next) => {
    try {
        const senderId = req.user.id;
        const { receiver_email, amount } = req.body;
        if (!receiver_email || !amount || isNaN(amount)) {
            return res.status(400).json({ status: 'error', message: 'receiver_email and a valid amount are required' });
        }
        const wallet = await (0, walletService_1.transferFunds)(senderId, receiver_email, Number(amount));
        res.status(200).json({
            status: 'success',
            message: 'Funds transferred successfully',
            data: { balance: wallet.balance }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.transfer = transfer;
const withdraw = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ status: 'error', message: 'A valid amount is required' });
        }
        const wallet = await (0, walletService_1.withdrawFunds)(userId, Number(amount));
        res.status(200).json({
            status: 'success',
            message: 'Funds withdrawn successfully',
            data: { balance: wallet.balance }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.withdraw = withdraw;
