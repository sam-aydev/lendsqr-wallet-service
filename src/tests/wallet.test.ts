import request from 'supertest';
import app from '../app';
import * as walletService from '../services/walletService';

// Mock the wallet service so we don't hit the actual database during tests
jest.mock('../services/walletService');

describe('Wallet Endpoints', () => {
  const mockUserId = 'test-user-uuid';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/wallets/fund', () => {
    
    // POSITIVE SCENARIO
    it('should successfully fund the wallet when a valid amount is provided', async () => {
      // Mock the service to return a fake updated balance
      (walletService.fundWallet as jest.Mock).mockResolvedValue({ balance: 50000 });

      const response = await request(app)
        .post('/api/wallets/fund')
        .set('Authorization', `Bearer ${mockUserId}`)
        .send({ amount: 50000 });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.balance).toBe(50000);
      expect(walletService.fundWallet).toHaveBeenCalledWith(mockUserId, 50000);
    });

    // my first negative scenairo: Invalid Amount
    it('should return a 400 error if the amount is missing or invalid', async () => {
      const response = await request(app)
        .post('/api/wallets/fund')
        .set('Authorization', `Bearer ${mockUserId}`)
        .send({ amount: 'invalid-string' }); 

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('A valid amount is required');
    });

    // Another negative scenairo, where there is no Auth Token
    it('should return a 401 error if no authorization token is provided', async () => {
      const response = await request(app)
        .post('/api/wallets/fund')
        .send({ amount: 50000 });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Unauthorized: No token provided');
    });

  });
});