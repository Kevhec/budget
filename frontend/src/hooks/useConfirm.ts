import { useContext } from 'react';
import { ConfirmContext, ContextType } from '@/context/ConfirmProvider';

function useConfirm(): ContextType {
  const confirmContext = useContext(ConfirmContext);
  if (confirmContext === undefined || confirmContext === null) {
    throw new Error('useConfirm must be used within an ConfirmProvider');
  }
  return confirmContext;
}

export default useConfirm;
