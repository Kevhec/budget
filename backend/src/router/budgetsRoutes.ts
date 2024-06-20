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
import { Budget, Page } from '../database/models';
import authorizeAccess from '../middleware/authorizeAccess';
import authorizeCreation from '../middleware/authorizeCreation';
import validateSchema from '../middleware/validateSchema';
import { createBudgetSchema, getAndDeleteBudgetSchema, updateBudgetSchema } from '../database/schemas/budget';

const router = Router();

router.route('/')
  .post(
    validateSchema(createBudgetSchema),
    authenticate,
    authorizeCreation(Page, 'pageId'),
    createBudget,
  )
  .get(
    authenticate,
    getAllBudgets,
  );

router.route('/:id')
  .get(
    validateSchema(getAndDeleteBudgetSchema),
    authenticate,
    authorizeAccess(Budget),
    getBudget,
  )
  .patch(
    validateSchema(updateBudgetSchema),
    authenticate,
    authorizeAccess(Budget),
    updateBudget,
  )
  .delete(
    validateSchema(getAndDeleteBudgetSchema),
    authenticate,
    authorizeAccess(Budget),
    deleteBudget,
  );

router.get('/:id/expenses', authenticate, authorizeAccess(Budget), getBudgetExpenses);

export default router;
