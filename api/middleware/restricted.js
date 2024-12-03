const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'your-secret-key';

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.substring(7);
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      console.log('Token verification error:', err)
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      console.log('Decoded token:', decodedToken);
      req.decodedJwt = decodedToken;
      next();
    }
  });
};