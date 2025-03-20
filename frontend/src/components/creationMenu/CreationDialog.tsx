import useTransactions from '@/hooks/useTransactions';
import {
  Budget, CreateBudgetParams, CreateTransactionParams, Transaction,
} from '@/types';
import useBudgets from '@/hooks/useBudgets';
import {
  ComponentType,
  ElementRef, forwardRef, useEffect, useState,
} from 'react';
import { cn } from '@/lib/utils';
import useAlert from '@/hooks/useAlert';
import { useTranslation } from 'react-i18next';
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
  triggerClassname?: string
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
  type, triggerLabel, item, editMode, modalTitle, triggerClassname,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const { createTransaction, updateTransaction } = useTransactions();
  const { createBudget } = useBudgets();
  const {
    isAlertOpen,
    confirm,
    setIsAlertOpen,
    showAlert,
    handleConfirm,
  } = useAlert();
  const { t } = useTranslation();

  const FormComponent = formMapping[type];
  const formId = `${type}-creation-form`;

  const triggerClasses = cn('capitalize', triggerClassname);

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
      transaction: (value: CreateTransactionParams) => {
        if (item) {
          updateTransaction(item.id, value);
        }
      },
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

  const handleOpen = async (open: boolean) => {
    if (isFormDirty && !open) {
      await showAlert();
    } else {
      setIsOpen(open);
    }
  };

  useEffect(() => {
    if (isFormDirty && confirm) {
      setIsOpen(false);
    }
  }, [confirm, isFormDirty]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpen} modal>
        <DialogTrigger ref={ref} className={triggerClasses}>
          {triggerLabel}
        </DialogTrigger>
        <DialogContent className="p-0 max-w-lg w-[calc(100%-2rem)] rounded-sm">
          <DialogDescription className="sr-only">
            {t('creationDialog.description')}
            {' '}
            {(triggerLabel || modalTitle)?.toLowerCase()}
          </DialogDescription>
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className='capitalize'>
              {modalTitle || triggerLabel}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[26rem]">
            <FormComponent
              className="p-6 pt-0"
              onSubmit={handleSubmit}
              formId={formId}
              dirtyChecker={setIsFormDirty}
              item={item as (Transaction & Budget) | undefined}
              editMode={editMode}
            />
          </ScrollArea>
          <DialogFooter className="p-6 pt-0">
            <Button form={formId} type="submit">
              {
                editMode ? (
                  t('common.save')
                ) : (
                  t('common.create')
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
        title={t('confirmDialog.alerts.save.title')}
        message={t('confirmationDialog.alerts.save.message')}
      />
    </>
  );
});

export default CreationDialog;
