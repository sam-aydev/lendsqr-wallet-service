import db from "../database";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/AppError";

export const fundWallet = async (userId: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError("Funding amount must be greater than zero", 400);
  }

  console.log(
    `DEBUG: userId received is [${userId}] with length ${userId.length}. Expected length is 36.`,
  );
  return await db.transaction(async (trx) => {
    // Get the user's wallet and lock the row to prevent race conditions
    const wallet = await trx("wallets")
      .where({ user_id: userId })
      .forUpdate()
      .first();

    if (!wallet) {
      throw new AppError("Wallet not found for this user", 404);
    }

    // Add funds to the wallet
    await trx("wallets").where({ id: wallet.id }).increment("balance", amount);

    // Record the transaction history
    const transactionId = uuidv4();
    await trx("transactions").insert({
      id: transactionId,
      wallet_id: wallet.id,
      type: "CREDIT",
      amount: amount,
      reference: `FUND-${transactionId}`,
      status: "SUCCESS",
    });

    // Return the updated balance
    const updatedWallet = await trx("wallets").where({ id: wallet.id }).first();
    return updatedWallet;
  });
};



export const transferFunds = async (senderId: string, receiverEmail: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError('Transfer amount must be greater than zero', 400);
  }

  return await db.transaction(async (trx) => {
    // Lock sender's wallet
    const senderWallet = await trx('wallets').where({ user_id: senderId }).forUpdate().first();
    
    if (!senderWallet) throw new AppError('Sender wallet not found', 404);
    if (Number(senderWallet.balance) < amount) throw new AppError('Insufficient funds for transfer', 400);

    // Find receiver by email
    const receiverUser = await trx('users').where({ email: receiverEmail }).first();
    if (!receiverUser) throw new AppError('Receiver account not found', 404);
    if (receiverUser.id === senderId) throw new AppError('You cannot transfer funds to yourself', 400);

    // Lock receiver's wallet
    const receiverWallet = await trx('wallets').where({ user_id: receiverUser.id }).forUpdate().first();
    if (!receiverWallet) throw new AppError('Receiver wallet not found', 404);

    // Update balances
    await trx('wallets').where({ id: senderWallet.id }).decrement('balance', amount);
    await trx('wallets').where({ id: receiverWallet.id }).increment('balance', amount);

    // Log both sides of the transaction
    const txOutId = uuidv4();
    const txInId = uuidv4();
    
    await trx('transactions').insert([
      { id: txOutId, wallet_id: senderWallet.id, type: 'TRANSFER', amount, reference: `TRX-OUT-${txOutId}`, status: 'SUCCESS' },
      { id: txInId, wallet_id: receiverWallet.id, type: 'CREDIT', amount, reference: `TRX-IN-${txInId}`, status: 'SUCCESS' }
    ]);

    // Return sender's updated balance
    return await trx('wallets').where({ id: senderWallet.id }).first();
  });
};

export const withdrawFunds = async (userId: string, amount: number) => {
  if (amount <= 0) {
    throw new AppError('Withdrawal amount must be greater than zero', 400);
  }

  return await db.transaction(async (trx) => {
    // Lock wallet
    const wallet = await trx('wallets').where({ user_id: userId }).forUpdate().first();
    
    if (!wallet) throw new AppError('Wallet not found', 404);
    if (Number(wallet.balance) < amount) throw new AppError('Insufficient funds for withdrawal', 400);

    // Deduct funds
    await trx('wallets').where({ id: wallet.id }).decrement('balance', amount);

    // Log transaction
    const txId = uuidv4();
    await trx('transactions').insert({
      id: txId, wallet_id: wallet.id, type: 'DEBIT', amount, reference: `WD-${txId}`, status: 'SUCCESS'
    });

    return await trx('wallets').where({ id: wallet.id }).first();
  });
};