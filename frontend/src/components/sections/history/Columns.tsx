import { formatMoney } from '@/lib/formatNumber';
import { Transaction } from '@/types';
import { format } from '@formkit/tempo';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './DataTableColumnHeader';
import ActionsMenu from './ActionsMenu';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      const formatted = format(date, 'long');

      return (
        <div>
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = formatMoney(amount);

      return (
        <div className="text-right font-medium">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
  },
  {
    accessorKey: 'category.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
  },
  {
    id: 'budgets',
    accessorFn: (row) => (row.budget ? `${row.budget.name}` : ''),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Presupuesto" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        /* TODO: Fix pointer events none when closing
        dropdown menu with escape key after modal was closed the same way.
        If escape key is pressed to close modal, dropdown closes too and pointer events none
        remain on document body, possible fix, persist dropdown open if escape key was pressed to
        close modal, then make the user press it again to close dropdown menu
        if wants to close it */
        <ActionsMenu
          item={transaction}
          type="transaction"
        />
      );
    },
  },
];
