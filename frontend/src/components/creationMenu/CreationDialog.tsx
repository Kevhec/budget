import useTransactions from '@/hooks/useTransactions';
import {
  Budget, CreateBudgetParams, CreateTransactionParams, Transaction,
} from '@/types';
import useBudgets from '@/hooks/useBudgets';
import {
  ComponentType,
  ElementRef, forwardRef, useCallback, useEffect, useState,
} from 'react';
import TransactionForm, { TransactionFormProps } from './forms/TransactionForm';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import BudgetForm, { BudgetFormProps } from './forms/BudgetForm';
import { ScrollArea } from '../ui/scroll-area';
import ConfirmDialog from '../ConfirmDialog';

interface Props {
  type: 'transaction' | 'budget'
  triggerLabel: string
  modalTitle?: string
  item?: Budget | Transaction
  editMode?: boolean
}

const formMapping: {
  transaction: ComponentType<TransactionFormProps>;
  budget: ComponentType<BudgetFormProps>;
} = {
  transaction: TransactionForm,
  budget: BudgetForm,
};

const CreationDialog = forwardRef<ElementRef<typeof DialogTrigger>, Props>(({
  type, triggerLabel, item, editMode, modalTitle,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertResolve, setAlertResolve] = useState<(value: boolean) => void>(() => {});
  const [confirm, setConfirm] = useState(false);
  const { createTransaction } = useTransactions();
  const { createBudget } = useBudgets();

  const FormComponent = formMapping[type];
  const formId = `${type}-creation-form`;

  const formHandlers = {
    creation: {
      transaction: (value: CreateTransactionParams) => {
        createTransaction(value);
      },
      budget: (value: CreateBudgetParams) => {
        createBudget(value);
      },
    },
    edition: {
      transaction: () => null,
      budget: () => null,
    },
  };

  const handleSubmit = async (value: any) => {
    const modeKey = editMode ? 'edition' : 'creation';

    const handler = formHandlers[modeKey][type];

    if (!handler) {
      throw new Error(`Unhandled creation type: ${type}`);
    }

    handler(value);
    setIsOpen(false);
  };

  const showAlert = useCallback((): Promise<boolean> => new Promise((resolve) => {
    setIsAlertOpen(true);
    setAlertResolve(() => resolve);
  }), []);

  const handleConfirm = (value: boolean) => {
    alertResolve(value);
  };

  const handleOpen = async (open: boolean) => {
    if (isFormDirty && !open) {
      const confirmResult = await showAlert();

      setConfirm(confirmResult);
    } else {
      setIsOpen(open);
    }
  };

  useEffect(() => {
    if (isFormDirty && confirm) {
      setIsOpen(false);
      setConfirm(false);
    }
  }, [confirm, isFormDirty]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpen} modal>
        <DialogTrigger ref={ref}>
          {triggerLabel}
        </DialogTrigger>
        <DialogContent className="p-0 max-w-lg w-[calc(100%-2rem)] rounded-sm">
          <DialogDescription className="sr-only">
            Crea un nuevo recurso para
            {' '}
            {modalTitle || triggerLabel}
          </DialogDescription>
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {modalTitle || triggerLabel}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[26rem]">
            <FormComponent
              className="p-6 pt-0"
              onSubmit={handleSubmit}
              formId={formId}
              dirtyChecker={setIsFormDirty}
              item={item as CreateTransactionParams & Budget}
              editMode={editMode}
            />
          </ScrollArea>
          <DialogFooter className="p-6 pt-0">
            <Button form={formId} type="submit">
              {
                editMode ? (
                  'Guardar'
                ) : (
                  'Crear'
                )
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        onConfirm={handleConfirm}
        onCancel={handleConfirm}
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        title="Cambios sin guardar"
        message="Tienes cambios sin guardar, ¿quieres continuar?"
      />
    </>
  );
});

export default CreationDialog;
