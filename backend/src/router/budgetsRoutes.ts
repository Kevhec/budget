import { Router } from 'express';
import checkAuth from '../middleware/checkAuth';

import {
  createBudget,
  deleteBudget,
  getAllBudgets,
  getBudget,
  updateBudget,
  getBudgetExpenses,
} from '../controllers/budget';

const router = Router();

router.route('/')
  .post(checkAuth, createBudget)
  .get(checkAuth, getAllBudgets);

router.route('/:id')
  .get(checkAuth, getBudget)
  .patch(checkAuth, updateBudget)
  .delete(checkAuth, deleteBudget);

router.get('/:id/expenses', checkAuth, getBudgetExpenses);

export default router;
