import { z } from 'zod';
import { budgetSchema, transactionSchema } from '@/schemas/creation';
import useTransactions from '@/hooks/useTransactions';
import { CreateBudgetParams, CreateTransactionParams } from '@/types';
import useBudgets from '@/hooks/useBudgets';
import TransactionForm from './forms/TransactionForm';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import BudgetForm from './forms/BudgetForm';
import { ScrollArea } from '../ui/scroll-area';

interface Props {
  type: 'transaction' | 'budget'
  label: string
}

const formMapping = {
  transaction: TransactionForm,
  budget: BudgetForm,
};

const schemaMapping = {
  transaction: transactionSchema,
  budget: budgetSchema,
};

export default function CreationDialog({ type, label }: Props) {
  const { createTransaction } = useTransactions();
  const { createBudget } = useBudgets();

  const schema = schemaMapping[type];

  const FormComponent = formMapping[type];
  const formId = `${type}-creation-form`;

  const handleSubmit = async (value: z.infer<typeof schema>) => {
    switch (type) {
      case 'transaction':
        createTransaction(value as CreateTransactionParams);
        break;
      case 'budget':
        createBudget(value as CreateBudgetParams);
        break;
      default:
        throw new Error(`Unhandled creation type: ${type}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        {label}
      </DialogTrigger>
      <DialogContent className="p-0 max-w-md w-[calc(100%-2rem)] rounded-sm">
        <DialogDescription className="sr-only">
          Crea un nuevo recurso para
          {' '}
          {label}
        </DialogDescription>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            Crear
            {' '}
            {label}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[26rem]">
          <FormComponent className="p-6 pt-0" onSubmit={handleSubmit} formId={formId} />
        </ScrollArea>
        <DialogFooter className="p-6 pt-0">
          <Button form={formId} type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
