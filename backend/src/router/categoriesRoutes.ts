import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from '../controllers/category';
import authenticate from '../middleware/authenticate';
import { Category, Budget } from '../database/models';
import authorizeAccess from '../middleware/authorizeAccess';
import authorizeCreation from '../middleware/authorizeCreation';
import validateSchema from '../middleware/validateSchema';
import { getObjectById } from '../database/schemas/general';
import { createCategorySchema, updateCategorySchema } from '../database/schemas/category';

const router = Router();

router.route('/')
  .post(
    validateSchema(createCategorySchema),
    authenticate,
    authorizeCreation(Budget, 'budgetId'),
    createCategory,
  )
  .get(
    authenticate,
    getAllCategories,
  );

router.route('/:id')
  .get(
    validateSchema(getObjectById),
    authenticate,
    authorizeAccess(Category),
    getCategory,
  )
  .patch(
    validateSchema(updateCategorySchema),
    authenticate,
    authorizeAccess(Category),
    updateCategory,
  )
  .delete(
    validateSchema(getObjectById),
    authenticate,
    authorizeAccess(Budget),
    deleteCategory,
  );

export default router;
