import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { fund, transfer, withdraw } from "../controllers/walletController";

const router = Router();
router.use(authenticate);
router.post("/fund", fund);
router.post('/transfer', transfer);
router.post('/withdraw', withdraw);


export default router;
