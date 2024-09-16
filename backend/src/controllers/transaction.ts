import { Request, Response } from 'express';
import { DatabaseError, Op } from 'sequelize';
import { Category, Transaction } from '../database/models';
import generateLinksMetadata from '../lib/utils/generateLinksMetadata';

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

    const transactionWithCategory = await Transaction.findOne({
      where: { id: newTransaction.id },
      attributes: { exclude: ['categoryId'] },
      include: [{
        model: Category,
        attributes: ['id', 'name', 'color'],
        as: 'category',
      }],
    });

    return res.status(201).json({ data: { transaction: transactionWithCategory } });
  } catch (error: unknown) {
    if (error instanceof DatabaseError) {
      const sequelizeError = error as { parent?: { code?: string, detail?: string } };

      if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
        if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
          return res.status(409).json(sequelizeError.parent.detail);
        }
      }
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Read
async function getAllTransactions(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const transactionId = req.params.id;
  const { offset, limit, month } = req.query;

  // offset conversion from data type assigned by req.query into integer
  const intOffset = parseInt(String(offset), 10);
  const intLimit = parseInt(String(limit), 10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId: req.user?.id,
  };

  if (month) {
    // If month is provided use it for filtering, formatted as YYYY-MM
    const [year, monthNumber] = String(month).split('-');

    // Define time range for sequelize between clause
    const startOfMonth = new Date(Number(year), Number(monthNumber) - 1, 1);
    const endOfMonth = new Date(Number(year), Number(monthNumber), 0);

    whereClause.createdAt = {
      [Op.between]: [startOfMonth, endOfMonth],
    };
  }

  try {
    // Order is established by created at date in desc order so newer
    // transactions are shown first
    const { count, rows } = await Transaction.findAndCountAll({
      where: whereClause,
      offset: intOffset,
      limit: intLimit,
      attributes: { exclude: ['categoryId'] },
      include: [{
        model: Category,
        attributes: ['id', 'name', 'color'],
        as: 'category',
      }],
      order: [['createdAt', 'DESC']],
    });

    if (!rows.length) {
      const noIdMessage = 'No expenses found';
      const withIdMessage = `Expense not found for specified id: ${transactionId}`;
      return res.status(404).json(transactionId ? withIdMessage : noIdMessage);
    }

    // This function implements an approach to JSON-API standard for pagination
    const { meta, links } = generateLinksMetadata({
      count, rows, offset: intOffset, limit: intLimit,
    });

    return res.status(200).json({
      data: rows,
      meta,
      links,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
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

    return res.status(200).json({ data: transaction });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
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

    return res.status(200).json({ data: updatedTransaction });
  } catch (error: unknown) {
    if (error instanceof DatabaseError) {
      const sequelizeError = error as { parent?: { code?: string, detail?: string } };

      if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
        if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
          return res.status(409).json(sequelizeError.parent.detail);
        }
      }
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
      data: {
        message: 'Transaction deleted successfully',
        deletedBudgetId: parseInt(budgetId, 10),
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
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
