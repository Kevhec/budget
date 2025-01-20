import CreationDialog from '@/components/creationMenu/CreationDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTransactions from '@/hooks/useTransactions';
import { CreationType, Transaction } from '@/types';
import { MoreHorizontal } from 'lucide-react';

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

  const handleDelete = () => {
    // TODO: Consider error message
    if (!item) return;

    switch (type) {
      case 'transaction':
        deleteTransaction(item.id);
        break;
      default:
        console.error('Not handled type');
    }
  };

  return (
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
          <Button variant="ghost" onClick={handleDelete} className="w-full bg-red-950 text-white hover:!bg-red-900 hover:!text-white">
            Eliminar
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
