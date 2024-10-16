import { getPaginatedBudgets } from '@/lib/budget';
import {
  Budget, BudgetAction, BudgetActionType, BudgetState, CreateBudgetParams, PaginatedParams,
} from '@/types';
import { Dispatch } from 'react';
import axiosClient from '@/config/axios';
import { initialBudgetState } from './budgetReducer';

async function syncBudgets(
  dispatch: Dispatch<BudgetAction>,
  options: PaginatedParams,
) {
  dispatch({
    type: BudgetActionType.SET_LOADING,
    payload: true,
  });

  try {
    const paginatedBudgets = await getPaginatedBudgets(options);

    dispatch({
      type: BudgetActionType.SYNC_BUDGETS,
      payload: paginatedBudgets,
    });
  } catch (error) {
    dispatch({
      type: BudgetActionType.SYNC_BUDGETS,
      payload: initialBudgetState.budgets,
    });
  } finally {
    dispatch({
      type: BudgetActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function createBudget(
  dispatch: Dispatch<BudgetAction>,
  budget: CreateBudgetParams,
  state: BudgetState,
) {
  dispatch({
    type: BudgetActionType.SET_LOADING,
    payload: true,
  });

  const currentPaginated = state.budgets;
  const currentPage = currentPaginated.meta?.currentPage;
  const currentLimit = currentPaginated.meta?.itemsPerPage;

  try {
    const { data } = await axiosClient.post('/budget', {
      ...budget,
    });

    const newBudget: Budget = data.data.budget;

    dispatch({
      type: BudgetActionType.CREATE_BUDGET,
      payload: newBudget,
    });

    if (currentPage === 1) {
      syncBudgets(dispatch, {
        page: currentPage || 1,
        limit: currentLimit || 30,
        date: new Date(),
      });
    }
  } catch (error) {
    dispatch({
      type: BudgetActionType.CREATE_BUDGET,
      payload: null,
    });
  } finally {
    dispatch({
      type: BudgetActionType.SET_LOADING,
      payload: false,
    });
  }
}

export {
  syncBudgets,
  createBudget,
};
