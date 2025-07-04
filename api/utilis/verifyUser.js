 const jwt = require('jsonwebtoken');
const  errorHandler = require( '../utilis/arrow.js'); // Make sure you have this utility

 const verifyToken = (req, res, next) => {
      console.log('Everything is correct');
 
  const token = req.cookies.access_token;
         console.log('token is ', token);

  if (!token) {
    return next(errorHandler(401, 'Unauthorized - No token provided'));
  }

    console.log('Everything is correct');
  jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret', (err, decoded) => {
      console.log('Everything is correct');
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return next(errorHandler(403, 'Forbidden - Invalid token'));
      }
      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(403, 'Forbidden - Token expired'));
      }
      return next(errorHandler(403, 'Forbidden - Token verification failed'));
    }

    // 4. Attach user data to request
    req.user = decoded;
    console.log('Everything is correct');
    next();
  });
};

module.exports = {verifyToken}