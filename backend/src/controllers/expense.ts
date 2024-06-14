import { Request, Response } from 'express';
import { UpdateOptions } from 'sequelize';
import { dontExist, isInt } from '../lib/validations';
import { Expense } from '../models';

// Create
async function createExpense(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const name = req.body?.name;
  const amount = req.body?.amount;
  const date = req.body?.date;
  const budgetId = req.body?.budgetId;

  // Create base for bad req error message, it will have
  // the key of the data that's wrong appended at the end
  let badReqErrorMsj = 'Bad request, missing data: ';

  // Validate which elements where not passed in the request
  const { error, errorElements } = dontExist({ name, amount });

  // If an error where found complete the error msg with the errorElements
  //  array and send it
  if (error) {
    const errorFieldsStr = `${errorElements.join(', ').trim()}.`;
    badReqErrorMsj += errorFieldsStr;
    return res.status(400).json(badReqErrorMsj);
  }

  try {
    const newExpense = await Expense.create({
      name,
      amount,
      date,
      BudgetId: budgetId,
    });

    return res.status(201).json({ expense: newExpense });
  } catch (e: any) {
    if (e.parent.code === '23503') {
      return res.status(409).json(e.parent.detail);
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Read
async function getAllExpenses(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const expenses = await Expense.findAll();

    if (!expenses.length) {
      return res.status(404).json('No expenses where found');
    }

    return res.status(200).json(expenses);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

async function getExpense(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const expenseId = req.params.id;

  try {
    if (!isInt(expenseId)) {
      return res.status(400).json('Id must be an integer');
    }

    const budget = await Expense.findOne({
      where: {
        id: expenseId,
      },
    });

    if (!budget) {
      return res.status(404).json(`Expense not found for specified id: ${expenseId}`);
    }

    return res.status(200).json(budget);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

// Update
async function updateExpense(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const expenseId = req.params.id;
    const reqBody = req.body;

    reqBody.BudgetId = reqBody.budgetId;

    const fieldsToUpdate = Object.keys(reqBody);

    if (!expenseId) {
      return res.status(400).json({ message: 'Bad request, id not found' });
    }

    if (Object.keys(reqBody).length === 0) {
      return res.status(400).json({ message: 'Request body cannot be empty' });
    }

    const options: UpdateOptions = {
      where: {
        id: expenseId,
      },
    };

    options.fields = fieldsToUpdate;

    const [, [updatedExpense]] = await Expense.update(
      reqBody,
      {
        ...options,
        returning: true,
      },
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    return res.status(200).json(updatedExpense);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    if (error.parent.code === '23503') {
      return res.status(409).json(error.parent.detail);
    }
    return res.status(500).json('Internal server error');
  }
}

// Delete
async function deleteExpense(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const budgetId = req.params.id;

  try {
    if (!isInt(budgetId)) {
      return res.status(400).json('Id must be an integer');
    }

    await Expense.destroy({
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
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
};
