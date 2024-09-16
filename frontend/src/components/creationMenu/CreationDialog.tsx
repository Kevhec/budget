import { z } from 'zod';
import TransactionForm from './forms/TransactionForm';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import transactionSchema from '@/schemas/creation';
import { createTransaction } from '@/lib/transaction';
import useGetTransactions from '@/hooks/useGetTransactions';

interface Props {
  type: 'transaction'/*  | 'budget' | 'category' */
  label: string
}

const formMapping = {
  transaction: TransactionForm,
};

const submitCallbackMapping = {
  transaction: createTransaction,
};

const schemaMapping = {
  transaction: transactionSchema,
};

export default function CreationDialog({ type, label }: Props) {
  const { addTransaction } = useGetTransactions();

  const FormComponent = formMapping[type];
  const creationCallback = submitCallbackMapping[type];
  const schema = schemaMapping[type];

  const formId = `${type}Form`;

  const handleSubmit = async (value: z.infer<typeof schema>) => {
    const newRecord = await creationCallback(value);

    if (!newRecord) return;

    if (type === 'transaction') {
      addTransaction(newRecord);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        {label}
      </DialogTrigger>
      <DialogContent className="max-w-sm w-[calc(100%-1rem)] rounded-sm">
        <DialogDescription className="sr-only">
          Crea un nuevo recurso para
          {' '}
          {type}
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>
            Crear
            {' '}
            {label}
          </DialogTitle>
        </DialogHeader>
        <FormComponent onSubmit={handleSubmit} formId={formId} />
        <DialogFooter>
          <Button form={formId} type="submit">Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
