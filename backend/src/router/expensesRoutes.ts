import { Router } from 'express';
import {
  deleteBudget, getBudget,
} from '../controllers/budget';
import {
  createExpense,
  getAllExpenses,
  updateExpense,
} from '../controllers/expense';
import authenticate from '../middleware/authenticate';
import { Budget, Expense } from '../models';
import authorizeCreation from '../middleware/authorizeCreation';
import authorizeAccess from '../middleware/authorizeAccess';

const router = Router();

router.route('/')
  .post(authenticate, authorizeCreation(Budget, 'budgetId'), createExpense)
  .get(authenticate, authorizeAccess(Expense), getAllExpenses);

router.route('/:id')
  .get(authenticate, authorizeAccess(Expense), getBudget)
  .patch(authenticate, authorizeAccess(Expense), updateExpense)
  .delete(authenticate, authorizeAccess(Expense), deleteBudget);

export default router;
