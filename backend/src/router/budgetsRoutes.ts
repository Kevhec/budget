import { Router } from 'express';
import {
  createBudget,
  deleteBudget,
  getAllBudgets,
  getBudget,
  updateBudget,
  getBudgetExpenses,
} from '../controllers/budget';
import authenticate from '../middleware/authenticate';
import { Budget, Page } from '../models';
import authorizeAccess from '../middleware/authorizeAccess';
import authorizeCreation from '../middleware/authorizeCreation';

const router = Router();

router.route('/')
  .post(authenticate, authorizeCreation(Page, 'pageId'), createBudget)
  .get(authenticate, authorizeAccess(Budget), getAllBudgets);

router.route('/:id')
  .get(authenticate, authorizeAccess(Budget), getBudget)
  .patch(authenticate, authorizeAccess(Budget), updateBudget)
  .delete(authenticate, authorizeAccess(Budget), deleteBudget);

router.get('/:id/expenses', authenticate, authorizeAccess(Budget), getBudgetExpenses);

export default router;
