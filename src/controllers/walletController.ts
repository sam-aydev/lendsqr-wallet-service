import { Response, NextFunction } from 'express';
import { fundWallet, transferFunds, withdrawFunds } from '../services/walletService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const fund = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id; // Extracted from our auth middleware
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        status: 'error',
        message: 'A valid amount is required'
      });
    }

    const wallet = await fundWallet(userId, Number(amount));

    res.status(200).json({
      status: 'success',
      message: 'Wallet funded successfully',
      data: {
        balance: wallet.balance
      }
    });
  } catch (error) {
    next(error);
  }
};


export const transfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const senderId = req.user!.id;
    const { receiver_email, amount } = req.body;

    if (!receiver_email || !amount || isNaN(amount)) {
      return res.status(400).json({ status: 'error', message: 'receiver_email and a valid amount are required' });
    }

    const wallet = await transferFunds(senderId, receiver_email, Number(amount));

    res.status(200).json({
      status: 'success',
      message: 'Funds transferred successfully',
      data: { balance: wallet.balance }
    });
  } catch (error) {
    next(error);
  }
};

export const withdraw = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ status: 'error', message: 'A valid amount is required' });
    }

    const wallet = await withdrawFunds(userId, Number(amount));

    res.status(200).json({
      status: 'success',
      message: 'Funds withdrawn successfully',
      data: { balance: wallet.balance }
    });
  } catch (error) {
    next(error);
  }
};