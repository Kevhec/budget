import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Login from './routes/Login';
import Guest from './routes/Guest';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import Dashboard from './routes/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="/login/guest" element={<Guest />} />
          </Route>
          <Route path="/dashboard" element={<AppLayout />}>
            <Route
              index
              element={(
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              )}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
