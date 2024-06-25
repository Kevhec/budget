import { Request, Response } from 'express';
import { Transaction } from '../database/models';

// Create
async function createTransaction(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const {
    description,
    amount,
    date,
    type,
    categoryId,
    budgetId,
    /*     endDate,
    frequency, */
  } = req.body;

  try {
    const newTransaction = await Transaction.create({
      description,
      amount,
      date,
      type,
      categoryId,
      budgetId,
      /*       endDate,
      frequency, */
      userId: req.user?.id || '',
    });

    return res.status(201).json({ expense: newTransaction });
  } catch (e: any) {
    if (e.parent.code === '23503') {
      return res.status(409).json(e.parent.detail);
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Read
async function getAllTransactions(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const transactions = await Transaction.findAll({
      where: {
        userId: req.user?.id,
      },
    });

    if (!transactions.length) {
      return res.status(404).json('No expenses where found');
    }

    return res.status(200).json(transactions);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

async function getTransaction(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        userId: req.user?.id,
      },
    });

    if (!transaction) {
      return res.status(404).json(`Expense not found for specified id: ${transactionId}`);
    }

    return res.status(200).json(transaction);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    return res.status(500).json('Internal server error');
  }
}

// Update
async function updateTransaction(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const transactionId = req.params.id;
  const reqBody = req.body;

  if (Object.keys(reqBody).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty' });
  }

  try {
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json(`Transaction not found for specified id: ${transactionId}`);
    }

    const updatedTransaction = await transaction.update(reqBody);

    return res.status(200).json(updatedTransaction);
  } catch (error: any) {
    console.error('ERROR: ', error.message);
    if (error.parent.code === '23503') {
      return res.status(409).json(error.parent.detail);
    }
    return res.status(500).json('Internal server error');
  }
}

// Delete
async function deleteTransaction(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const budgetId = req.params.id;

  try {
    await Transaction.destroy({
      where: {
        id: budgetId,
        userId: req.user?.id,
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
  createTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
