import { Request, Response } from 'express';
import {
  DatabaseError, fn, literal, Op,
} from 'sequelize';
import { Category, Transaction } from '../database/models';
import generateLinksMetadata from '../lib/utils/generateLinksMetadata';
import generateDateRange from '../lib/utils/generateDateRange';
import {
  BalanceData, BalanceResponse, CreateTransactionRequestBody, JobTypes, MonthData, TypedRequest,
} from '../lib/types';
import generateCronExpression from '../lib/cron_manager/generateCronExpression';
import CronTask from '../database/models/cronTask';
import CronJob from '../database/models/cronJobs';
import { Job, scheduleCronTask } from '../lib/cron_manager/taskScheduler';
import { sanitizeObject } from '../lib/utils';
import { createTransaction as createTransactionJob } from '../lib/jobs';

// Create
async function createTransaction(
  req: TypedRequest<CreateTransactionRequestBody>,
  res: Response,
): Promise<Response | undefined> {
  const {
    description,
    amount,
    date,
    type,
    categoryId,
    budgetId,
    recurrence,
  } = req.body;

  try {
    let taskId: null | string = null;

    const dateObject = new Date(date);

    if (recurrence) {
      const {
        concurrence, time, weekDay, endDate,
      } = recurrence;
      const { minute, hour, timezone } = time;
      const { steps, type: concurrenceType } = concurrence;

      const recurrenceEndDate = endDate ? new Date(endDate) : undefined;

      const cronExpression = generateCronExpression({
        concurrence: {
          type: concurrenceType,
          steps,
        },
        startDate: dateObject,
        time: {
          minute,
          hour,
          timezone,
        },
        weekDay,
      });

      const newTask = await CronTask.create({
        cronExpression,
        endDate: recurrenceEndDate || null,
        timezone,
      });

      const job = await CronJob.create({
        jobName: JobTypes.CREATE_TRANSACTION,
        jobArgs: {
          description,
          amount,
          date,
          type,
          categoryId,
          budgetId: budgetId || '',
          userId: req.user?.id || '',
          cronTaskId: newTask.id,
        },
        cronTaskId: newTask.id,
      });

      const typedJob = job as unknown as Job;

      taskId = newTask.id;

      scheduleCronTask({
        cronExpression,
        endDate: recurrenceEndDate,
        timezone,
        taskId,
        jobs: [typedJob],
      });
    }

    const newTransaction = await createTransactionJob({
      description,
      amount,
      date: dateObject,
      type,
      budgetId,
      categoryId,
      cronTaskId: taskId,
      userId: req.user?.id || '',
    });

    if (!newTransaction) {
      return res.status(500).json('There was an error creating the new transaction');
    }

    const sanitizedTransaction = sanitizeObject(newTransaction.toJSON(), ['cronTaskId']);

    return res.status(201).json({ data: { transaction: sanitizedTransaction } });
  } catch (error: unknown) {
    if (error instanceof DatabaseError) {
      const sequelizeError = error as { parent?: { code?: string, detail?: string } };

      if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
        if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
          return res.status(409).json(sequelizeError.parent.detail);
        }
      }
    }

    console.log(error);

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

  // Convert to string to ensure types
  let strOffset;
  let strLimit;
  let strMonth;

  if (offset) strOffset = String(offset);

  if (limit) strLimit = String(limit);

  if (month) strMonth = String(month);

  // offset conversion from data type assigned by req.query into integer
  const intOffset = parseInt(strOffset || '', 10);
  const intLimit = parseInt(strLimit || '', 10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId: req.user?.id,
  };

  if (month) {
    // If month is provided use it for filtering, formatted as YYYY-MM
    const dateRange = generateDateRange({ fromDate: strMonth });

    if (dateRange) {
      const [start, end] = dateRange;

      whereClause.createdAt = {
        [Op.between]: [start, end],
      };
    }
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

    console.log({ rows: rows.map((row) => row.get()) });

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

async function getBalance(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const { from, to } = req.query;

  let strFrom;
  let strTo;

  if (from) strFrom = String(from);
  if (to) strTo = String(to);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId: req.user?.id,
  };

  const dateRange = generateDateRange({ fromDate: strFrom, toDate: strTo, untilToday: !strTo });

  if (dateRange) {
    const [start, end] = dateRange;

    whereClause.createdAt = {
      [Op.between]: [start, end],
    };
  }

  try {
    const balanceResponse = await Transaction.findAll({
      where: whereClause,
      attributes: [
        [fn('EXTRACT', literal('YEAR from "date"')), 'year'],
        [fn('EXTRACT', literal('MONTH from "date"')), 'month'],
        [fn('SUM', literal('CASE WHEN "type" = \'income\' THEN "amount" ELSE 0 END')), 'totalIncome'],
        [fn('SUM', literal('CASE WHEN "type" = \'expense\' THEN "amount" ELSE 0 END')), 'totalExpense'],
        [fn('SUM', literal(
          `CASE
            WHEN "type" = 'income' THEN "amount"
            WHEN "type" = 'expense' THEN - "amount"
          END`,
        )), 'balance'],
      ],
      group: [
        fn('EXTRACT', literal('YEAR from "date"')),
        fn('EXTRACT', literal('MONTH from "date"')),
      ],
      order: [
        [fn('EXTRACT', literal('YEAR from "date"')), 'ASC'],
        [fn('EXTRACT', literal('MONTH from "date"')), 'ASC'],
      ],
    });

    if (!balanceResponse.length) {
      const notFoundMessage = 'No balance found';
      return res.status(404).json(notFoundMessage);
    }

    const formattedRes: BalanceData = {};

    balanceResponse.forEach((item) => {
      const {
        year, month, totalIncome, totalExpense, balance,
      } = item.dataValues as unknown as BalanceResponse;

      const monthData: MonthData = {
        totalIncome,
        totalExpense,
        balance,
      };

      formattedRes[year] ||= {};

      formattedRes[year][month] = monthData;
    });

    return res.status(200).json({
      data: formattedRes,
    });
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
  getBalance,
  updateTransaction,
  deleteTransaction,
};
