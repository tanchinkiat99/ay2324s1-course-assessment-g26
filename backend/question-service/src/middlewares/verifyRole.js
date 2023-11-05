import jwt from 'jsonwebtoken';

export const verifyRole = (role) => (req, res, next) => {
  // console.log('VERIFYING');
  try {
    if (!req.headers.authorization) {
      res.status(401).json({ message: 'No authorization token provided' });
    }
    const token = req.headers.authorization.split(' ')[1]; // 'Bearer TOKEN'
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded.role);
    if (decoded.role == role) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient permissions' });
    }
  } catch (error) {
    // console.log(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
