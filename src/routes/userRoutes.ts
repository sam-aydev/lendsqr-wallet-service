import { Router } from 'express';
import { createAccount } from '../controllers/userController';

const router = Router();

router.post('/signup', createAccount);

export default router;