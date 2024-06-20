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
import { Budget, Expense } from '../database/models';
import authorizeCreation from '../middleware/authorizeCreation';
import authorizeAccess from '../middleware/authorizeAccess';
import validateSchema from '../middleware/validateSchema';
import { createExpenseSchema, getAndDeleteExpenseSchema, updateExpenseSchema } from '../database/schemas/expense';

const router = Router();

router.route('/')
  .post(
    validateSchema(createExpenseSchema),
    authenticate,
    authorizeCreation(Budget, 'budgetId'),
    createExpense,
  )
  .get(
    authenticate,
    authorizeAccess(Expense),
    getAllExpenses,
  );

router.route('/:id')
  .get(
    validateSchema(getAndDeleteExpenseSchema),
    authenticate,
    authorizeAccess(Expense),
    getBudget,
  )
  .patch(
    validateSchema(updateExpenseSchema),
    authenticate,
    authorizeAccess(Expense),
    updateExpense,
  )
  .delete(
    validateSchema(getAndDeleteExpenseSchema),
    authenticate,
    authorizeAccess(Expense),
    deleteBudget,
  );

export default router;
