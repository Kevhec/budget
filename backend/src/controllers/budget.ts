import type { Request, Response } from 'express';
import {
  DatabaseError, fn, literal, Op,
} from 'sequelize';
import { format } from '@formkit/tempo';
import { Budget, Transaction } from '../database/models';
import generateDateRange from '../lib/utils/generateDateRange';
import {
  createBudget as createBudgetJob,
  createConcurrence as createConcurrenceJob,
} from '../lib/jobs';
import { JobTypes, type CreateBudgetRequestBody, type TypedRequest } from '../lib/types';
import { generateLinksMetadata, sanitizeObject } from '../lib/utils';
import extractBudgetBalance from '../lib/jobs/extractBudgetBalance';
import setupOrUpdateJob from '../lib/cron_manager/setupJob';
import Concurrence from '../database/models/concurrence';
import upsertConcurrence from '../lib/cron_manager/upsertConcurrence';

// TODO: Sanitize returned objects to not return userId

// Create
async function createBudget(
  req: TypedRequest<CreateBudgetRequestBody>,
  res: Response,
): Promise<Response | undefined> {
  const {
    name,
    totalAmount,
    startDate,
    endDate,
    concurrence,
  } = req.body;

  const {
    user,
  } = req;

  try {
    let taskId: null | string = null;
    let concurrenceId: null | string = null;

    const startDateObj = new Date(startDate);

    // If recurrence is provided, overwrite endDateObj to
    // nextExecutionDate instead of normal non concurrent budgets end date.
    let endDateObj = new Date(endDate);

    if (concurrence && user) {
      const newConcurrence = await createConcurrenceJob({ concurrence, user });

      concurrenceId = newConcurrence.id;

      const {
        nextExecutionDate,
        taskId: newTaskId,
      } = await setupOrUpdateJob({
        user,
        concurrence,
        startDate: startDateObj,
        jobName: JobTypes.CREATE_BUDGET,
        particularJobArgs: {
          name,
          totalAmount,
        },
      });

      // Budget ends when a new one of the same task is going to be created
      endDateObj = nextExecutionDate;

      taskId = newTaskId;
    }

    const newBudget = await createBudgetJob({
      name,
      totalAmount,
      startDate: startDateObj,
      endDate: endDateObj,
      userId: user?.id || '',
      cronTaskId: taskId,
      concurrenceId,
    });

    const sanitizedBudget = sanitizeObject(newBudget.toJSON(), ['cronTaskId', 'userId']);

    return res.status(201).json({ data: { budget: sanitizedBudget } });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Read
async function getAllBudgets(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const {
    offset, limit, month, balance,
  } = req.query;
  const userId = req.user?.id || '' as string;

  // Convert to string to ensure types
  let strOffset;
  let strLimit;
  let strMonth;

  if (offset) strOffset = String(offset);

  if (limit) strLimit = String(limit);

  if (month) strMonth = String(month || format(new Date(), 'YYYY-MM'));

  const intOffset = parseInt(strOffset || '0', 10);
  const intLimit = parseInt(strLimit || '', 10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId,
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
    const { count, rows } = await Budget.findAndCountAll({
      where: whereClause,
      offset: intOffset,
      limit: intLimit || undefined,
      include: [
        {
          model: Concurrence,
          as: 'concurrence',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId', 'id'],
          },
        },
      ],
      attributes: { exclude: ['cronTaskId', 'userId', 'concurrenceId'] },
      order: [['createdAt', 'DESC']],
    });

    if (!rows.length) {
      const notFoundMessage = 'No budgets found';
      return res.status(404).json(notFoundMessage);
    }

    const { meta, links } = generateLinksMetadata({
      count, rows, offset: intOffset, limit: intLimit,
    });

    let budgetsToReturn = rows.map((item) => item.get());

    if (balance) {
      const budgetsIds = rows.map((budget) => budget.id) as string[];

      const budgetsBalance = await extractBudgetBalance({ userId, budgetId: budgetsIds });

      budgetsToReturn = rows.map((budget) => ({
        ...budget.get(),
        balance: budgetsBalance ? budgetsBalance[budget.id] : { totalIncome: 0, totalExpense: 0 },
      }));
    }

    return res.status(200).json({
      data: budgetsToReturn,
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
      attributes: {
        exclude: ['cronTaskId', 'userId'],
      },
    });

    if (!budget) {
      return res.status(404).json(`Budget not found for specified id: ${budgetId}`);
    }

    return res.status(200).json({ data: budget });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
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

    return res.status(200).json({ data: expenses });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

async function getBudgetBalance(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const userId = req.user?.id;
  const { from, to } = req.query;

  let strFrom;
  let strTo;

  if (from) strFrom = String(from);
  if (to) strTo = String(to);

  const [start, end] = generateDateRange({ fromDate: strFrom, toDate: strTo });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId,
    createdAt: {
      [Op.between]: [start, end],
    },
  };

  try {
    const balance = await Transaction.findAll({
      include: [
        {
          model: Budget,
          as: 'budget',
          where: {
            userId,
          },
        },
      ],
      where: whereClause,
      attributes: [
        [fn('SUM', literal('CASE WHEN "type" = \'income\' THEN "amount" ELSE 0 END')), 'totalIncome'],
        [fn('SUM', literal('CASE WHEN "type" = \'expense\' THEN "amount" ELSE 0 END')), 'totalExpense'],
      ],
      group: ['budgetId', 'budget.id'],
    });

    if (!balance.length) {
      return res.status(404).json('No balance found');
    }

    return res.status(200).json({
      data: {
        month: start?.getMonth(),
        balance,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

// Update
async function updateBudget(
  req: TypedRequest<CreateBudgetRequestBody>,
  res: Response,
): Promise<Response | undefined> {
  const budgetId = req.params.id;
  const reqBody = req.body;

  try {
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      return res.status(404).json(`Budget not found for specified id: ${budgetId}`);
    }

    const {
      name,
      totalAmount,
      startDate,
      endDate,
      concurrence,
    } = reqBody;

    const {
      user,
    } = req;

    const prevBudgetData = budget.get();
    const {
      concurrenceId: prevConcurrenceId,
      cronTaskId: prevCronTaskId,
      startDate: prevStartDate,
      endDate: prevEndDate,
    } = prevBudgetData;

    const startDateObj = startDate ? new Date(startDate) : prevStartDate;
    let endDateObj = endDate ? new Date(endDate) : prevEndDate;

    let newConcurrenceId = prevConcurrenceId;
    let newCronTaskId = prevCronTaskId;

    if (concurrence && user) {
      const newConcurrenceData = await upsertConcurrence({
        user,
        concurrence,
        startDate: startDateObj,
        jobName: JobTypes.CREATE_BUDGET,
        jobArgs: {
          name,
          totalAmount,
        },
        prevConcurrenceId,
        prevCronTaskId,
      });

      if (!newConcurrenceData) {
        return res.status(500).json('Internal server error');
      }

      const {
        concurrenceId,
        taskId,
        nextExecutionDate,
      } = newConcurrenceData;

      newConcurrenceId = concurrenceId;
      newCronTaskId = taskId;
      endDateObj = nextExecutionDate;
    }

    const updatedBudget = await budget.update({
      name,
      totalAmount,
      startDate: startDateObj,
      endDate: endDateObj,
      concurrenceId: newConcurrenceId,
      cronTaskId: newCronTaskId,
    });

    const sanitizedBudget = sanitizeObject(updatedBudget.toJSON(), ['cronTaskId']);

    return res.status(200).json({ data: sanitizedBudget });
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

    await budget?.destroy();

    return res.status(200).json({
      data: {
        message: 'Budget deleted successfully',
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
  createBudget,
  getAllBudgets,
  getBudget,
  getBudgetBalance,
  updateBudget,
  deleteBudget,
  getBudgetExpenses,
};
