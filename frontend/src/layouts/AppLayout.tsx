import {
  Navigate, Outlet, useLocation,
} from 'react-router-dom';
import { CirclePlus } from 'lucide-react';
import { SidebarProvider } from '@/context/SidebarProvider';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import CreationDialog from '@/components/creationMenu/CreationDialog';
import TransactionsProvider from '@/context/TransactionContext';
import CategoriesProvider from '@/context/CategoriesProvider';

export default function AppLayout() {
  const location = useLocation();

  if (location.pathname === '/app/') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <CategoriesProvider>
      <TransactionsProvider>
        <div className="flex w-screen h-screen font-inter relative">
          <div className="fixed bottom-2 right-2 z-10">
            <Popover>
              <PopoverTrigger className="bg-primary rounded-full p-2 text-white">
                <CirclePlus className="w-9 h-9" />
                <span className="sr-only">Crear elemento</span>
              </PopoverTrigger>
              <PopoverContent align="end" className="flex flex-col gap-2">
                <CreationDialog type="transaction" label="Transacción" />
              </PopoverContent>
            </Popover>
          </div>
          <SidebarProvider>
            <aside className="hidden md:block px-6 pt-5 pb-4 bg-[#343A40] text-white min-w-60 font-openSans">
              <p className="text-3xl font-semibold mb-32 font-openSans">Budget</p>
              <Navigation />
            </aside>
            <div className="h-full flex flex-col grow">
              <Header />
              <main className="bg-softGray h-full grow">
                <ScrollArea className="min-w-full h-full">
                  <Outlet />
                </ScrollArea>
              </main>
            </div>
          </SidebarProvider>
        </div>
      </TransactionsProvider>
    </CategoriesProvider>
  );
}
