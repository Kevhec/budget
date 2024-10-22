import { Budget } from '@/src/database/models';
import { CreateBudgetParams } from '../types';

async function createBudget({
  name,
  totalAmount,
  startDate = new Date(),
  endDate,
  intervalMilliseconds,
  userId,
  cronTaskId,
}: CreateBudgetParams) {
  try {
    let calculatedEndDate = endDate;

    if (!endDate && intervalMilliseconds) {
      const dateFromInterval = new Date(intervalMilliseconds);
      calculatedEndDate = dateFromInterval;
    }

    const newBudget = await Budget.create({
      name,
      totalAmount,
      startDate,
      endDate: calculatedEndDate,
      userId,
      cronTaskId,
    });

    return newBudget;
  } catch (error) {
    throw new Error('Error occurred while creating new Budget');
  }
}

export default createBudget;
