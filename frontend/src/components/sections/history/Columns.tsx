import { formatMoney } from '@/lib/formatNumber';
import { Transaction } from '@/types';
import { format } from '@formkit/tempo';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './DataTableColumnHeader';
import ActionsMenu from './ActionsMenu';
import { useTranslation } from 'react-i18next';
import Typography from '@/components/Typography';
import CategoryBadge from '@/components/CategoryBadge';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    cell: ({ row }) => {
      const { i18n } = useTranslation();
      const currentLanguage = i18n.language;

      const date = new Date(row.getValue('date'));
      const formatted = format(date, 'long', currentLanguage);

      return (
        <div>
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" textOnly />
    ),
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
        <p className="text-right font-medium">
          {formatted}
        </p>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const { t } = useTranslation();
      const transaction = row.original

      return (
        <p>
          {t(`common.${transaction.type}.singular`)}
        </p>
      )
    }
  },
  {
    accessorKey: 'category.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
    cell: ({ row }) => {
      const transaction = row.original;
      const category = transaction.category;

      return (
        <div className='flex justify-center'>
          <CategoryBadge category={category} />
        </div>
      )
    }
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
