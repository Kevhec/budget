import ConfirmDialog from '@/components/ConfirmDialog';
import CreationDialog from '@/components/creationMenu/CreationDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAlert from '@/hooks/useAlert';
import useTransactions from '@/hooks/useTransactions';
import { CreationType, Transaction } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface Props {
  item: Transaction
  type: CreationType,
}

const typeTranslationMapping = {
  transaction: 'transacción',
  budget: 'presupuesto',
};

export default function ActionsMenu({
  item,
  type,
}: Props) {
  const { deleteTransaction } = useTransactions();
  const {
    isAlertOpen,
    confirm,
    setIsAlertOpen,
    setConfirm,
    showAlert,
    handleConfirm,
  } = useAlert();

  const handleDelete = useCallback(() => {
    // TODO: Consider error message
    if (!item) return;

    switch (type) {
      case 'transaction':
        deleteTransaction(item.id);
        break;
      default:
        console.error('Not handled type');
    }
  }, [deleteTransaction, item, type]);

  useEffect(() => {
    if (!confirm) return;

    handleDelete();
    setConfirm(false);
  }, [confirm, handleDelete, setConfirm]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-2">
          <DropdownMenuLabel>
            Acciones
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <CreationDialog
              type={type}
              triggerLabel="Editar"
              triggerClassname="px-2 py-2 text-sm w-full hover:bg-slate-100 rounded-sm transition-colors font-medium"
              modalTitle={`Editar ${typeTranslationMapping[type]}`}
              item={item}
              editMode
            />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button variant="ghost" onClick={showAlert} className="w-full bg-red-950 text-white hover:!bg-red-900 hover:!text-white">
              Eliminar
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        onConfirm={handleConfirm}
        onCancel={handleConfirm}
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        title="Eliminar transacción"
        message={`Se eliminará la transacción ${item.description}, esta acción es irreversible.`}
      />
    </>
  );
}
