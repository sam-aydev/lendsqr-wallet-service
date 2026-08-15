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
const userService = __importStar(require("../services/userService"));
// Mock the user service
jest.mock('../services/userService');
describe('User Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /api/users/signup', () => {
        // POSITIVE SCENARIO
        it('should successfully create a user and wallet', async () => {
            userService.createUserAccount.mockResolvedValue({
                user: { id: 'user-uuid', firstName: 'Samuel', lastName: 'Adetunji', email: 'samuel@example.com' },
                wallet: { id: 'wallet-uuid', balance: 0.00 }
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/users/signup')
                .send({ first_name: 'Samuel', last_name: 'Adetunji', email: 'samuel@example.com' });
            expect(response.status).toBe(201);
            expect(response.body.status).toBe('success');
            expect(response.body.data.user.email).toBe('samuel@example.com');
        });
        // NEGATIVE SCENARIO
        it('should return a 400 error if required fields are missing', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/users/signup')
                .send({ first_name: 'Samuel' }); // Missing last_name and email
            expect(response.status).toBe(400);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('first_name, last_name, and email are required fields');
        });
    });
});
