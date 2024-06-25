import { Request, Response } from 'express';
import { Category } from '../database/models';

// Create
async function createCategory(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const {
    name,
    color,
  } = req.body;

  try {
    const newCategory = await Category.create({
      name,
      color,
      userId: req.user?.id || '',
    });

    return res.status(201).json({ category: newCategory });
  } catch (e: any) {
    console.error('ERROR: ', e.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Read
async function getAllCategories(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const categories = await Category.findAll({
      where: {
        userId: req.user?.id,
      },
    });

    if (!categories.length) {
      return res.status(404).json('No categories where found');
    }

    return res.status(200).json(categories);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

async function getCategory(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const categoryId = req.params.id;

  try {
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId: req.user?.id,
      },
    });

    if (!category) {
      return res.status(404).json(`Category not found for specified id: ${categoryId}`);
    }

    return res.status(200).json(category);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

// Update
async function updateCategory(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const categoryId = req.params.id;
  const reqBody = req.body;

  if (Object.keys(reqBody).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty' });
  }

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json(`Category not found for specified id: ${categoryId}`);
    }

    const updatedCategory = await category.update(reqBody);

    return res.status(200).json(updatedCategory);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

// Delete
async function deleteCategory(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const categoryId = req.params.id;

  try {
    await Category.destroy({
      where: {
        id: categoryId,
        userId: req.user?.id,
      },
    });

    return res.status(200).json({
      message: 'Category deleted successfully',
      deletedCategoryId: parseInt(categoryId, 10),
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

export {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
