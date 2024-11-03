import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Login from './routes/public/Login';
import Guest from './routes/public/Guest';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import Dashboard from './routes/private/Dashboard';
import ProtectedRoute from './routes/private/ProtectedRoute';
import { TooltipProvider } from './components/ui/tooltip';
import History from './routes/private/History';
import Budgets from './routes/private/Budgets';
import VerifyAccount from './routes/public/VerifyAccount';
import SignUp from './routes/public/SignUp';

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/login/guest" element={<Guest />} />
              <Route path="/verify/:token" element={<VerifyAccount />} />
            </Route>
            <Route path="/app" element={<AppLayout />}>
              <Route
                path="/app/dashboard"
                element={(
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
              )}
              />
              <Route
                path="/app/budgets"
                element={(
                  <ProtectedRoute>
                    <Budgets />
                  </ProtectedRoute>
              )}
              />
              <Route
                path="/app/history"
                element={(
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
              )}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
