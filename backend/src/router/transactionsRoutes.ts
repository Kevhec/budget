import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
} from '../controllers/transaction';
import authenticate from '../middleware/authenticate';
import { Budget, Transaction } from '../database/models';
import authorizeCreation from '../middleware/authorizeCreation';
import authorizeAccess from '../middleware/authorizeAccess';
import validateSchema from '../middleware/validateSchema';
import { createTransactionSchema, updateTransactionSchema } from '../database/schemas/transaction';
import { getObjectById } from '../database/schemas/general';

const router = Router();

router.route('/')
  .post(
    validateSchema(createTransactionSchema),
    authenticate,
    authorizeCreation(Budget, 'budgetId'),
    createTransaction,
  )
  .get(
    authenticate,
    authorizeAccess(Transaction),
    getAllTransactions,
  );

router.route('/:id')
  .get(
    validateSchema(getObjectById),
    authenticate,
    authorizeAccess(Transaction),
    getTransaction,
  )
  .patch(
    validateSchema(updateTransactionSchema),
    authenticate,
    authorizeAccess(Transaction),
    updateTransaction,
  )
  .delete(
    validateSchema(getObjectById),
    authenticate,
    authorizeAccess(Transaction),
    deleteTransaction,
  );

export default router;
