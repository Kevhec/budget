import { Budget } from '@/src/database/models';
import { CreateBudgetParams } from '../types';

async function createBudget({
  name,
  totalAmount,
  startDate,
  endDate,
  userId,
  cronTaskId,
}: CreateBudgetParams) {
  try {
    const newBudget = await Budget.create({
      name,
      totalAmount,
      startDate,
      endDate,
      userId,
      cronTaskId,
    });

    return newBudget;
  } catch (error) {
    throw new Error('Error occurred while creating new Budget');
  }
}

export default createBudget;
