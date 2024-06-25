import { Request, Response } from 'express';
import { Budget, Transaction } from '../database/models';

// Create
async function createBudget(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const {
    name,
    totalAmount,
    startDate,
    endDate,
  } = req.body;

  try {
    const newBudget = await Budget.create({
      name,
      totalAmount,
      startDate,
      endDate,
      userId: req.user?.id || '',
    });

    return res.status(201).json({ budget: newBudget });
  } catch (e: any) {
    console.error('ERROR: ', e.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Read
async function getAllBudgets(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const budgets = await Budget.findAll({
      where: {
        userId: req.user?.id,
      },
    });

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
    const budget = await Budget.findOne({
      where: {
        id: budgetId,
        userId: req.user?.id,
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

    const expenses = await Budget.findOne({
      where: {
        id: budgetId,
        userId: req.user?.id,
      },
      include: Transaction,
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
  const budgetId = req.params.id;
  const reqBody = req.body;

  if (Object.keys(reqBody).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty' });
  }

  try {
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      return res.status(404).json(`Budget not found for specified id: ${budgetId}`);
    }

    if (budget?.isGeneral) {
      return res.status(400).json('Cannot modify the general budget.');
    }

    const updatedBudget = await budget.update(reqBody);

    return res.status(200).json(updatedBudget);
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
    const budget = await Budget.findOne({
      where: {
        id: budgetId,
        userId: req.user?.id,
      },
    });

    if (!budget) {
      return res.status(404).json(`Budget not found for id: ${budgetId}`);
    }

    if (budget?.isGeneral) {
      return res.status(400).json('Cannot delete the general budget');
    }

    await budget?.destroy();

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
