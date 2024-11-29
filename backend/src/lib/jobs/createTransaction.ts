import { Category, Transaction } from '@/src/database/models';
import type { CreateTransactionParams } from '../types';

async function createTransaction({
  description,
  amount,
  date,
  type,
  budgetId,
  categoryId,
  cronTaskId,
  userId,
}: CreateTransactionParams) {
  try {
    const generalCategory = await Category.findOne({
      where: {
        name: 'General',
        isDefault: true,
      },
    });

    const newTransaction = await Transaction.create({
      description,
      amount,
      date,
      type,
      budgetId,
      categoryId: categoryId || generalCategory?.id,
      cronTaskId,
      userId,
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

    return transactionWithCategory;
  } catch (error) {
    throw new Error('Error occurred while creating new Transaction');
  }
}

export default createTransaction;
