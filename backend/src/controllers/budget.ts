import { Request, Response } from 'express';
import { UpdateOptions } from 'sequelize';
import { Budget, Expense } from '../models';
import { isInt } from '../lib/validations';

// Create
async function createBudget(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const name = req.body?.name;

  try {
    if (!name) {
      return res.status(400).json('Name not found');
    }

    const newBudget = await Budget.create({
      name,
    });

    return res.status(201).json({ budget: newBudget });
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Read
async function getAllBudgets(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const budgets = await Budget.findAll();

    if (!budgets.length) {
      return res.status(404).json('No budgets where found');
    }

    return res.status(200).json(budgets);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

async function getBudget(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const budgetId = req.params.id;

  try {
    if (!isInt(budgetId)) {
      return res.status(400).json('Id must be an integer');
    }

    const budget = await Budget.findOne({
      where: {
        id: budgetId,
      },
    });

    if (!budget) {
      return res.status(404).json(`Budget not found for specified id: ${budgetId}`);
    }

    return res.status(200).json(budget);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

async function getBudgetExpenses(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const budgetId = req.params.id;

    if (!isInt(budgetId)) {
      return res.status(400).json('Id must be an integer');
    }

    const expenses = await Budget.findOne({
      where: {
        id: budgetId,
      },
      include: Expense,
    });

    if (!expenses) {
      return res.status(404).json(`No budget where found for id ${budgetId}`);
    }

    return res.status(200).json(expenses);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

// Update
async function updateBudget(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const budgetId = req.params.id;
    const reqBody = req.body;
    const fieldsToUpdate = Object.keys(reqBody);

    if (!budgetId) {
      return res.status(400).json({ message: 'Bad request, id not found' });
    }

    if (Object.keys(reqBody).length === 0) {
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }

    const options: UpdateOptions = {
      where: {
        id: budgetId,
      },
    };

    options.fields = fieldsToUpdate;

    const [, [updatedBudget]] = await Budget.update(
      reqBody,
      {
        ...options,
        returning: true,
      },
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    return res.status(200).json(updatedBudget);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

// Delete
async function deleteBudget(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const budgetId = req.params.id;

  try {
    if (!isInt(budgetId)) {
      return res.status(400).json('Id must be an integer');
    }

    await Budget.destroy({
      where: {
        id: budgetId,
      },
    });

    return res.status(200).json({
      message: 'Budget deleted successfully',
      deletedBudgetId: parseInt(budgetId, 10),
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

export {
  createBudget,
  getAllBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetExpenses,
};
