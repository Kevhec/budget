import {
  Navigate, Outlet, useLocation,
} from 'react-router';
import { CirclePlus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CreationDialog from '@/components/creationMenu/CreationDialog';
import TransactionsProvider from '@/context/TransactionProvider';
import CategoriesProvider from '@/context/CategoriesProvider';
import BudgetProvider from '@/context/BudgetProvider';
import Footer from '@/components/Footer';
/* import { SidebarProvider } from '@/components/ui/sidebar'; */

export default function AppLayout() {
  const location = useLocation();

  if (location.pathname === '/app/') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
  /*     <SidebarProvider> */
    <CategoriesProvider>
      <TransactionsProvider>
        <BudgetProvider>
          <div className="flex min-h-screen max-h-screen font-inter relative bg-softGray">
            <div className="fixed bottom-2 right-4 z-10">
              <Popover>
                <PopoverTrigger className="bg-primary rounded-full p-2 text-white">
                  <CirclePlus className="w-9 h-9" />
                  <span className="sr-only">Crear elemento</span>
                </PopoverTrigger>
                <PopoverContent align="end" className="flex flex-col gap-2">
                  <CreationDialog type="transaction" triggerLabel="Transacción" modalTitle="Crear Transacción" />
                  <CreationDialog type="budget" triggerLabel="Presupuesto" modalTitle="Crear Presupuesto" />
                </PopoverContent>
              </Popover>
            </div>
            <aside className="hidden lg:block px-6 pt-5 pb-4 bg-[#343A40] text-white min-w-60 font-openSans">
              <p className="text-3xl font-semibold mb-32 font-openSans">Budmin</p>
              <Navigation />
            </aside>
            <div className="flex flex-col w-full">
              <Header />
              <ScrollArea className="w-full h-full">
                <main className="px-4 py-2 md:py-4 flex flex-col bg-softGray md:h-full grow max-w-[100vw]">
                  <Outlet />
                </main>
                <Footer />
              </ScrollArea>
            </div>
          </div>
        </BudgetProvider>
      </TransactionsProvider>
    </CategoriesProvider>
  /*     </SidebarProvider> */
  );
}
