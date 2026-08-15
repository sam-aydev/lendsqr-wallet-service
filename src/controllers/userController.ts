import { Request, Response, NextFunction } from 'express';
import { createUserAccount } from '../services/userService';

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name, email } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'first_name, last_name, and email are required fields' 
      });
    }

    const data = await createUserAccount(first_name, last_name, email);

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      data
    });
  } catch (error) {
    // Pass the error to the global error handler in app.ts
    next(error); 
  }
};