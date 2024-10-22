import { Request, Response } from 'express';
import { fn, literal, Op } from 'sequelize';
import { Budget, Transaction } from '../database/models';
import generateDateRange from '../lib/utils/generateDateRange';
import generateCronExpression from '../lib/cron_manager/generateCronExpression';
import CronTask from '../database/models/cronTask';
import CronJob from '../database/models/cronJobs';
import { createBudget as createBudgetJob } from '../lib/jobs';
import { Job, scheduleCronTask } from '../lib/cron_manager/taskScheduler';
import { CreateBudgetRequestBody, JobTypes, TypedRequest } from '../lib/types';
import { sanitizeObject } from '../lib/utils';
import generateNextExecutionDate from '../lib/cron_manager/generateNexExecutionDate';
import getDateTimeDifference from '../lib/utils/time/getDateTimeDifference';

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
    recurrence,
  } = req.body;

  try {
    let taskId: null | string = null;

    const startDateObj = new Date(startDate);

    // When recurrence is provided, end date refers to the moment to stop repeating
    let endDateObj = new Date(endDate);

    if (recurrence) {
      const {
        concurrence, time, weekDay, endDate: recEndDateStr,
      } = recurrence;
      const { minute, hour, timezone } = time;
      const { steps, type } = concurrence;

      const recurrenceEndDate = recEndDateStr ? new Date(recEndDateStr) : null;

      const cronExpression = generateCronExpression({
        concurrence: {
          type,
          steps,
        },
        startDate: startDateObj,
        time: {
          minute,
          hour,
          timezone,
        },
        weekDay,
      });

      const nextExecutionDate = generateNextExecutionDate(cronExpression, { tz: timezone });

      endDateObj = nextExecutionDate;

      const intervalMilliseconds = getDateTimeDifference(startDateObj, nextExecutionDate);

      const newTask = await CronTask.create({
        cronExpression,
        endDate: recurrenceEndDate || null,
        timezone,
      });

      const job = await CronJob.create({
        jobName: JobTypes.CREATE_BUDGET,
        jobArgs: {
          name,
          totalAmount,
          intervalMilliseconds,
          userId: req.user?.id || '',
          cronTaskId: newTask.id,
        },
        cronTaskId: newTask.id,
      });

      const typedJob = job as unknown as Job;

      taskId = newTask.id;

      scheduleCronTask({
        cronExpression,
        endDate: endDateObj,
        timezone,
        taskId,
        jobs: [typedJob],
      });
    }

    const newBudget = await createBudgetJob({
      name,
      totalAmount,
      startDate: startDateObj,
      endDate: endDateObj,
      userId: req.user?.id || '',
      cronTaskId: taskId,
    });

    const sanitizedBudget = sanitizeObject(newBudget.toJSON(), ['cronTaskId']);

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
  try {
    const budgets = await Budget.findAll({
      where: {
        userId: req.user?.id,
      },
      attributes: {
        exclude: ['cronTaskId'],
      },
    });

    if (!budgets.length) {
      return res.status(404).json('No budgets where found');
    }

    return res.status(200).json({ data: budgets });
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
        exclude: ['cronTaskId'],
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

  const [start, end] = generateDateRange({});

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

    const updatedBudget = await budget.update(reqBody);

    const sanitizedBudget = sanitizeObject(updatedBudget.toJSON(), ['cronTaskId']);

    return res.status(200).json({ data: sanitizedBudget });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
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
