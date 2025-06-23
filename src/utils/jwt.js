import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {Object} payload - The payload to encode in the token
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
      issuer: 'car-listing-api',
      audience: 'car-listing-app'
    });
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

/**
 * Verify JWT token
 * @param {string} token - The token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'car-listing-api',
      audience: 'car-listing-app'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Generate access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing access and refresh tokens
 */
export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role
  };

  const accessToken = generateToken(payload, '15m'); // Short-lived access token
  const refreshToken = generateToken({ id: user._id }, '7d'); // Long-lived refresh token

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 // 15 minutes in seconds
  };
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};
