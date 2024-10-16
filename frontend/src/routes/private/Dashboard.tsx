import { NavLink } from 'react-router-dom';
import Typography from '@/components/Typography';
import RecentTransactions from '@/components/sections/dashboard/RecentTransactions';
import GeneralResume from '@/components/sections/dashboard/GeneralResume';
import CategoryBalanceGraph from '@/components/sections/dashboard/CategoryBalanceGraph';

export default function Dashboard() {
  return (
    <div className="">
      <div className="mb-2">
        <div className="mb-2">
          <section className="mb-2">
            <GeneralResume />
          </section>
          <section className="rounded-md bg-white p-4">
            <div className="flex justify-between items-center pb-4">
              <Typography variant="h2">
                Últimas transacciones
              </Typography>
              <NavLink to="#" className="text-sm text-blueishGray">
                Ver más
              </NavLink>
            </div>
            <RecentTransactions />
          </section>
        </div>
        <section>
          <CategoryBalanceGraph />
        </section>
      </div>
      <div>
        <section>
          Presupuestos del mes
        </section>
        <section>
          Gráfico así va tu dinero
        </section>
      </div>
    </div>
  );
}
