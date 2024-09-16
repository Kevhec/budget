import { CircleDollarSign, Clock8, LayoutDashboard } from 'lucide-react';
import TooltipNavLink from './primitives/NavLink';
import { cn } from '@/lib/utils';

const navigationArray = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/budgets', icon: CircleDollarSign, label: 'Presupuestos' },
  { to: '/app/history', icon: Clock8, label: 'Histórico' },
];

type Props = {
  className?: string
};

export default function Navigation({ className }: Props) {
  const classes = cn('flex flex-col gap-y-5', className);
  return (
    <nav className={classes}>
      {navigationArray.map((linkData) => (
        <TooltipNavLink
          key={`sidebar-link-${linkData.label.toLowerCase()}`}
          to={linkData.to}
          icon={linkData.icon}
          label={linkData.label}
        />
      ))}
    </nav>
  );
}
