import { budgetReducer, initialBudgetState } from '@/reducers/budget/budgetReducer';
import { BudgetReducer, CreateBudgetParams } from '@/types';
import {
  createContext, useCallback, useMemo, useReducer,
} from 'react';
import { createBudget as createBudgetAction } from '@/reducers/budget/budgetActions';
import { BudgetContextType } from '../types/budget';

export const BudgetContext = createContext<BudgetContextType | null>(null);

function BudgetProvider({ children }: React.PropsWithChildren) {
  const [
    state,
    dispatch,
  ] = useReducer<BudgetReducer>(budgetReducer, initialBudgetState);

  const createBudget = useCallback((data: CreateBudgetParams) => {
    createBudgetAction(dispatch, data, state);
  }, [state]);

  const contextValue = useMemo<BudgetContextType>(() => ({
    state,
    createBudget,
  }), [state, createBudget]);

  return (
    <BudgetContext.Provider value={contextValue}>
      { children }
    </BudgetContext.Provider>
  );
}

export default BudgetProvider;
