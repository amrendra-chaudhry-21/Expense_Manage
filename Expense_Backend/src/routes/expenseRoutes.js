import express from 'express';
import { 
  getExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense 
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getExpenses)
  .post(protect, addExpense);

router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

export default router;
