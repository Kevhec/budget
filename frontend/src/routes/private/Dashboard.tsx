import RecentTransactions from '@/components/sections/dashboard/RecentTransactions';
import GeneralResume from '@/components/sections/dashboard/GeneralResume';
import CategoryBalanceGraph from '@/components/sections/dashboard/CategoryBalanceGraph';
import RecentBudgets from '@/components/sections/dashboard/RecentBudgets';

export default function Dashboard() {
  return (
    <div className="">
      <div className="mb-4">
        <div className="mb-2">
          <GeneralResume />
          <RecentTransactions />
        </div>
        <CategoryBalanceGraph />
      </div>
      <div>
        <RecentBudgets />
        <section>
          Gráfico así va tu dinero
        </section>
      </div>
    </div>
  );
}
