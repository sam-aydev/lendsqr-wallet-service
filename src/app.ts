import express, { Request, Response, NextFunction } from "express";
import { AppError } from "./utils/AppError";
import userRoutes from "./routes/userRoutes";
import walletRoutes from "./routes/walletRoutes";

const app = express();

// The middleware to parse incoming JSON payloads
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/wallets", walletRoutes);

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "success", message: "Lendsqr wallet API is running!" });
});

// The global error handling middleware
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error("UNEXPECTED ERROR:", err);
  }

  res.status(statusCode).json({
    status: "error",
    message,
  });
});

export default app;
