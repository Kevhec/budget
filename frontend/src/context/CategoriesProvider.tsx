import {
  createContext, PropsWithChildren, useCallback, useEffect, useMemo, useReducer,
} from 'react';
import { CategoriesContextType, CategoryReducer } from '@/types';
import { categoryReducer, initialCategoriesState } from '@/reducers/category/categoryReducer';
import {
  syncCategories as syncCategoriesAction,
  getBalance as getBalanceAction,
} from '@/reducers/category/categoryActions';

export const CategoriesContext = createContext<CategoriesContextType | null>(null);

function CategoriesProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer<CategoryReducer>(categoryReducer, initialCategoriesState);

  useEffect(() => {
    syncCategoriesAction(dispatch);
    getBalanceAction(dispatch);
  }, []);

  const updateBalance = useCallback(() => {
    getBalanceAction(dispatch);
  }, []);

  const contextValue = useMemo(() => ({
    state,
    updateBalance,
  }), [state, updateBalance]);

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
}

export default CategoriesProvider;
