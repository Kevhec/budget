import { Router } from 'express';

import {
  deleteBudget, getBudget,
} from '../controllers/budget';
import {
  createExpense,
  getAllExpenses,
  updateExpense,
} from '../controllers/expense';

const router = Router();

router.route('/')
  .post(createExpense)
  .get(getAllExpenses);

router.route('/:id')
  .get(getBudget)
  .patch(updateExpense)
  .delete(deleteBudget);

export default router;
