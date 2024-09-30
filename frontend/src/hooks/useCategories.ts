import { useContext } from 'react';
import { CategoriesContext, CategoriesContextType } from '@/context/CategoriesProvider';

function useCategories(): CategoriesContextType {
  const authContext = useContext(CategoriesContext);
  if (authContext === undefined || authContext === null) {
    throw new Error('useCategories must be used within an CategoriesProvider');
  }
  return authContext;
}

export default useCategories;
