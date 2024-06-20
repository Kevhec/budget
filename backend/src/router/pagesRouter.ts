import { Router } from 'express';
import {
  createPage, deletePage, getAllPages, updatePage,
} from '../controllers/page';
import validateSchema from '../middleware/validateSchema';
import authenticate from '../middleware/authenticate';
import { Page } from '../database/models';
import { createPageSchema, getAndDeletePageSchema, updatePageSchema } from '../database/schemas/page';
import { getBudget } from '../controllers/budget';
import authorizeAccess from '../middleware/authorizeAccess';

const router = Router();

router.route('/')
  .post(
    validateSchema(createPageSchema),
    authenticate,
    createPage,
  )
  .get(
    authenticate,
    getAllPages,
  );

router.route('/:id')
  .get(
    validateSchema(getAndDeletePageSchema),
    authenticate,
    getBudget,
  )
  .patch(
    validateSchema(updatePageSchema),
    authenticate,
    authorizeAccess(Page),
    updatePage,
  )
  .delete(
    validateSchema(getAndDeletePageSchema),
    authenticate,
    authorizeAccess(Page),
    deletePage,
  );
export default router;
