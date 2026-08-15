"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const walletService = __importStar(require("../services/walletService"));
// Mock the wallet service so we don't hit the actual database during tests
jest.mock("../services/walletService");
describe("Wallet Endpoints", () => {
    const mockUserId = "test-user-uuid";
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("POST /api/wallets/fund", () => {
        // POSITIVE SCENARIO
        it("should successfully fund the wallet when a valid amount is provided", async () => {
            // Mock the service to return a fake updated balance
            walletService.fundWallet.mockResolvedValue({
                balance: 50000,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/wallets/fund")
                .set("Authorization", `Bearer ${mockUserId}`)
                .send({ amount: 50000 });
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.data.balance).toBe(50000);
            expect(walletService.fundWallet).toHaveBeenCalledWith(mockUserId, 50000);
        });
        // my first negative scenairo: Invalid Amount
        it("should return a 400 error if the amount is missing or invalid", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/wallets/fund")
                .set("Authorization", `Bearer ${mockUserId}`)
                .send({ amount: "invalid-string" });
            expect(response.status).toBe(400);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toBe("A valid amount is required");
        });
        // Another negative scenairo, where there is no Auth Token
        it("should return a 401 error if no authorization token is provided", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/wallets/fund")
                .send({ amount: 50000 });
            expect(response.status).toBe(401);
            expect(response.body.status).toBe("error");
            expect(response.body.message).toBe("Unauthorized: No token provided");
        });
    });
    describe("POST /api/wallets/withdraw", () => {
        // POSITIVE SCENARIO
        it("should successfully withdraw funds", async () => {
            walletService.withdrawFunds.mockResolvedValue({
                balance: 40000,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/wallets/withdraw")
                .set("Authorization", `Bearer ${mockUserId}`)
                .send({ amount: 10000 });
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.data.balance).toBe(40000);
        });
        // NEGATIVE SCENARIO
        it("should return a 400 error if the amount is invalid", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/wallets/withdraw")
                .set("Authorization", `Bearer ${mockUserId}`)
                .send({ amount: "invalid" });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("A valid amount is required");
        });
    });
    describe("POST /api/wallets/transfer", () => {
        // POSITIVE SCENARIO
        it("should successfully transfer funds to another user", async () => {
            walletService.transferFunds.mockResolvedValue({
                balance: 25000,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/wallets/transfer")
                .set("Authorization", `Bearer ${mockUserId}`)
                .send({ receiver_email: "jane@example.com", amount: 15000 });
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("success");
            expect(response.body.data.balance).toBe(25000);
        });
        // NEGATIVE SCENARIO
        it("should return a 400 error if the receiver email is missing", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/wallets/transfer")
                .set("Authorization", `Bearer ${mockUserId}`)
                .send({ amount: 15000 }); // Missing receiver_email
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("receiver_email and a valid amount are required");
        });
    });
});
