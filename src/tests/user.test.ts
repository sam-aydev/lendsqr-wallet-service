import request from 'supertest';
import app from '../app';
import * as userService from '../services/userService';

// Mock the user service
jest.mock('../services/userService');

describe('User Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/signup', () => {
    // POSITIVE SCENARIO
    it('should successfully create a user and wallet', async () => {
      (userService.createUserAccount as jest.Mock).mockResolvedValue({
        user: { id: 'user-uuid', firstName: 'Samuel', lastName: 'Adetunji', email: 'samuel@example.com' },
        wallet: { id: 'wallet-uuid', balance: 0.00 }
      });

      const response = await request(app)
        .post('/api/users/signup')
        .send({ first_name: 'Samuel', last_name: 'Adetunji', email: 'samuel@example.com' });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe('samuel@example.com');
    });

    // NEGATIVE SCENARIO
    it('should return a 400 error if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/users/signup')
        .send({ first_name: 'Samuel' }); // Missing last_name and email

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('first_name, last_name, and email are required fields');
    });
  });
});