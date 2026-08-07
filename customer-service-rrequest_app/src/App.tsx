
import AppRoutes from './routes/app.route'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import { CallbackPage } from './pages/CallBackPage';
import { AuthGate } from './auth/AuthGate';
import LoginPage from './pages/login';
import { Layout } from './components/layout/Layout';

function App() {

  return (
    <Routes>
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <AuthGate>
            <Layout>
              <>
              <AppRoutes />
              </>
            </Layout>

          </AuthGate>
        }
      />
    </Routes>
  )
}

export default App
