import { Outlet } from 'react-router-dom';
import {} from 'lucide-react';

export default function AppLayout() {
  return (
    <div className="flex">
      <aside className="px-6 pt-5 pb-4 bg-[#343A40] min-h-screen text-white min-w-56">
        <p className="text-3xl font-semibold">Budget</p>
        <nav>
          Nav
        </nav>
      </aside>
      <div>
        <header>Header</header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
