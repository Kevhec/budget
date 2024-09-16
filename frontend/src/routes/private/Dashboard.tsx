import { NavLink } from 'react-router-dom';
import GeneralResumeCard from '@/components/GeneralResumeCard';
import Typography from '@/components/Typography';
import RecentTransactions from '@/components/sections/dashboard/RecentTransactions';

export default function Dashboard() {
  return (
    <div className="p-2">
      <div className="mb-2">
        <div className="">
          <div className="mb-2 grid grid-cols-2 gap-2">
            <GeneralResumeCard variant="default" title="Saldo total" value={0} className="col-span-2" />
            <GeneralResumeCard variant="income" title="Ingresos" value={0} className="col-span-1" />
            <GeneralResumeCard variant="expense" title="Gastos" value={0} className="col-span-1" />
          </div>
          <div className="rounded-md bg-white p-4">
            <div className="flex justify-between items-center pb-4">
              <Typography variant="h2">
                Últimas transacciones
              </Typography>
              <NavLink to="#" className="text-sm text-blueishGray">
                Ver más
              </NavLink>
            </div>
            <RecentTransactions />
          </div>
        </div>
        <div>
          Graph
        </div>
      </div>
      <div>
        <div>
          Presupuestos del mes
        </div>
        <div>
          Gráfico así va tu dinero
        </div>
      </div>
    </div>
  );
}
