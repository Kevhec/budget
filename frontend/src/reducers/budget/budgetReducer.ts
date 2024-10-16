import { initialPaginatedState } from '@/lib/constants';
import {
  Budget, BudgetAction, BudgetActionType, BudgetState, PaginatedApiResponse,
} from '@/types';

const initialBudgetState = {
  budgets:
    initialPaginatedState as PaginatedApiResponse<Budget[]>,
  loading: false,
};

function budgetReducer(state: BudgetState, action: BudgetAction) {
  switch (action.type) {
    case BudgetActionType.SYNC_BUDGETS:
      return ({
        ...state,
        budgets: action.payload,
        loading: false,
      });
    case BudgetActionType.CREATE_BUDGET: {
      const newBudget = action.payload;

      const currentBudgets = state.budgets;

      const isFirstPage = currentBudgets.meta?.currentPage === 1;

      const newBudgets = isFirstPage && currentBudgets.data
        ? [
          newBudget,
          ...currentBudgets.data,
        ]?.slice(0, currentBudgets.meta?.itemsPerPage || 30)
        : currentBudgets.data;

      const updatedBudgets = {
        ...currentBudgets,
        data: newBudgets,
      };

      return ({
        ...state,
        data: updatedBudgets,
      });
    }
    case BudgetActionType.SET_LOADING:
      return ({
        ...state,
        loading: action.payload,
      });
    default:
      return state;
  }
}

export {
  budgetReducer,
  initialBudgetState,
};
