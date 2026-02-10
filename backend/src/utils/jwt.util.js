import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (payload, expiresIn) => {
  try {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '1d' }
    );
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

export { generateToken, verifyToken };