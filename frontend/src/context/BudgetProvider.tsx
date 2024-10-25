import { budgetReducer, initialBudgetState } from '@/reducers/budget/budgetReducer';
import { BudgetReducer, CreateBudgetParams, PaginatedParams } from '@/types';
import {
  createContext, useCallback, useEffect, useMemo, useReducer,
} from 'react';
import { BudgetContextType } from '@/types/budget';
import {
  createBudget as createBudgetAction,
  syncPaginatedBudgets as syncPaginatedBudgetsAction,
  syncRecentBudgets as syncRecentBudgetsAction,
} from '@/reducers/budget/budgetActions';
import { defaultPaginatedOptions } from '@/lib/constants';

export const BudgetContext = createContext<BudgetContextType | null>(null);

function BudgetProvider({ children }: React.PropsWithChildren) {
  const [
    state,
    dispatch,
  ] = useReducer<BudgetReducer>(budgetReducer, initialBudgetState);

  const createBudget = useCallback((data: CreateBudgetParams) => {
    createBudgetAction(dispatch, data, state);
  }, [state]);

  const getBudgets = useCallback((options: PaginatedParams) => {
    syncPaginatedBudgetsAction(dispatch, options, true);
  }, []);

  const updateRecentBudgets = useCallback(() => {
    syncRecentBudgetsAction(dispatch);
  }, []);

  const contextValue = useMemo<BudgetContextType>(() => ({
    state,
    createBudget,
    getBudgets,
    updateRecentBudgets,
  }), [state, createBudget, getBudgets, updateRecentBudgets]);

  useEffect(() => {
    syncRecentBudgetsAction(dispatch);
    syncPaginatedBudgetsAction(dispatch, defaultPaginatedOptions);
    syncPaginatedBudgetsAction(dispatch, undefined, true);
  }, []);

  return (
    <BudgetContext.Provider value={contextValue}>
      { children }
    </BudgetContext.Provider>
  );
}

export default BudgetProvider;
