import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserCredentials, AuthResponse } from '../../shared/src/types/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production
const SALT_ROUNDS = 10;

// In-memory user store (replace with database in production)
const users: Record<string, any> = {};

router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName }: UserCredentials = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      } as AuthResponse);
    }
    
    // Check if user already exists
    if (users[email]) {
      return res.status(409).json({ 
        success: false, 
        message: 'User already exists' 
      } as AuthResponse);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create user
    const userId = `user_${Date.now()}`;
    users[email] = {
      id: userId,
      email,
      password: hashedPassword,
      firstName,
      lastName
    };
    
    // Generate JWT
    const token = jwt.sign(
      { id: userId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName
      }
    } as AuthResponse);
    
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    } as AuthResponse);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password }: UserCredentials = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      } as AuthResponse);
    }
    
    // Check if user exists
    const user = users[email];
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      } as AuthResponse);
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      } as AuthResponse);
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    } as AuthResponse);
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    } as AuthResponse);
  }
});

// Utility middleware to verify JWT token
export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: No token provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Invalid token' 
    });
  }
};

export default router; 