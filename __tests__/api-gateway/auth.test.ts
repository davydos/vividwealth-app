import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from '../../api-gateway/routes/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock JWT implementation
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn().mockReturnValue({ id: 'user_123', email: 'test@example.com' })
}));

// Mock BCrypt implementation
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn().mockImplementation((password, hash) => {
    return Promise.resolve(hash === `hashed_${password}` || hash === 'hashed_password');
  })
}));

describe('Authentication Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/auth', authRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    it('should create a user and return token', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token', 'mock-token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('firstName', 'Test');
      expect(response.body.user).toHaveProperty('lastName', 'User');
      expect(response.body.user).toHaveProperty('id');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('should return 409 if user already exists', async () => {
      // First create a user
      await request(app)
        .post('/auth/signup')
        .send({
          email: 'exists@example.com',
          password: 'password123'
        });

      // Try to create the same user again
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'exists@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/auth/signup')
        .send({
          email: 'login@example.com',
          password: 'password123',
          firstName: 'Login',
          lastName: 'Test'
        });
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'login@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    it('should return 401 if user does not exist', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      // Override bcrypt compare mock for this test
      (bcrypt.compare as jest.Mock).mockImplementationOnce(() => Promise.resolve(false));

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token', 'mock-token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'login@example.com');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
    });
  });
}); 