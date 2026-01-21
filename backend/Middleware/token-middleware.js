import { verifyToken } from '../Routes/Security/jwt-util.js';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Invalid token format',
        code: 'INVALID_FORMAT'
      });
    }

    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    const message = error.message || 'Invalid token';
    const code = error.message === 'Token has expired' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    
    return res.status(401).json({ 
      message,
      code
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export { authMiddleware, adminMiddleware };