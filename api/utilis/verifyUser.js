 const jwt = require('jsonwebtoken');

const  {errorHandler} = require( '../utilis/arrow.js'); // Make sure you have this utility

 const verifyToken = (req, res, next) => {
  console.log('Cookies received:', req.cookies);
console.log('Headers:', req.headers);
   
 
  const token = req.cookies.access_token || req.headers.access_token;
         console.log('token is ', token);

  if (!token) {
    return next(errorHandler(401, 'Unauthorized - No token provided'));
  }

   
  jwt.verify(token, process.env.JWT_SECERT || 'your_fallback_secret', (err, decoded) => {
     
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
    console.log('Everything is correct at the verify taken new stpes is start');
    next();
  });
};

module.exports = {verifyToken}