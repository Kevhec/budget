import { NavLink } from 'react-router-dom';
import Typography from '@/components/Typography';
import RecentTransactions from '@/components/sections/dashboard/RecentTransactions';
import GeneralResume from '@/components/sections/dashboard/GeneralResume';

export default function Dashboard() {
  return (
    <div className="p-2">
      <div className="mb-2">
        <div className="">
          <div className="mb-2">
            <GeneralResume />
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
          <CategoryBalanceGraph />
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
