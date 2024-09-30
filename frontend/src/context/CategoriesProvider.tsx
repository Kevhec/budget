import {
  createContext, PropsWithChildren, useEffect, useMemo, useState,
} from 'react';
import { Category } from '@/types';
import getCategories from '@/lib/category/getCategories';

export interface CategoriesContextType {
  categories: Category[] | null
}

export const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
});

function CategoriesProvider({ children }: PropsWithChildren) {
  const [categories, setCategories] = useState<Category[] | null>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const newCategories = await getCategories();
        setCategories(newCategories);
      } catch (error: any) {
        throw new Error(error.message);
      }
    };
    fetchCategories();
  }, []);

  const contextValue = useMemo(() => ({
    categories,
  }), [categories]);

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
}

export default CategoriesProvider;
