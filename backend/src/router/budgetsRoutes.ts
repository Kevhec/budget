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
import { createBudgetSchema, updateBudgetSchema } from '../database/schemas/budget';
import { getObjectById } from '../database/schemas/general';

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
    validateSchema(getObjectById),
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
    validateSchema(getObjectById),
    authenticate,
    authorizeAccess(Budget),
    deleteBudget,
  );

router.get('/:id/transactions', authenticate, authorizeAccess(Budget), getBudgetExpenses);

export default router;
