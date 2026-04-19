import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Optimization: Route-based Code Splitting
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Incomes = lazy(() => import('./pages/Incomes'));

// Fallback loader for lazy loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-darkBg">
    <div className="w-16 h-16 relative">
      <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-neonAmber animate-spin"></div>
      <div className="absolute inset-2 rounded-full border-l-2 border-r-2 border-neonOrange animate-spin animate-reverse"></div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="incomes" element={<Incomes />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
