import db from "../database";
import { AppError } from "../utils/AppError";
import { checkKarmaBlacklist } from "./adjutorService";
import { v4 as uuidv4 } from 'uuid';

export const createUserAccount = async (
  firstName: string,
  lastName: string,
  email: string,
) => {
  const existingUser = await db("users").where({ email }).first();

  if(existingUser){
    throw new AppError("Email is already registered!", 400)

  }

  await checkKarmaBlacklist(email)

  const result = await db.transaction(async(trx)=> {
    const userId = uuidv4()
    const walletId = uuidv4()

    await trx("users").insert({
        id: userId, 
        first_name: firstName,
        last_name: lastName,
        email: email
    })

    await trx("wallets").insert({
        id: walletId,
        user_id: userId,
        balance: 0.00
    })

    return {
      user: { id: userId, firstName, lastName, email },
      wallet: { id: walletId, balance: 0.00 }
    };
  })

  return result
};
