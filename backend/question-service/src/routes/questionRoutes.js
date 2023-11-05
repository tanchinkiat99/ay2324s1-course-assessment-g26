import express from 'express';
import {
  createQuestion,
  getQuestionById,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController.js';
import { verifyRole } from '../middlewares/verifyRole.js';

const router = express.Router();

// Check bearer token and role for every question route
// router.use((req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       res.status(401).json({ message: 'No authorization token provided' });
//     }
//     const token = req.headers.authorization.split(' ')[1]; // 'Bearer TOKEN'
//     if (!token) {
//       res.status(401).json({ message: 'No token provided' });
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // console.log(decoded.role);
//     if (decoded.role == 'user') {
//       next();
//     } else {
//       res.status(403).json({ message: 'Insufficient permissions' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// });

router.post('/new', verifyRole('maintainer'), createQuestion);
router.get('/', verifyRole('user'), getAllQuestions);
router.get('/:id', verifyRole('user'), getQuestionById);
router.patch('/:id', verifyRole('maintainer'), updateQuestion);
router.delete('/:id', verifyRole('maintainer'), deleteQuestion);

export default router;
