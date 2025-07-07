import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FormPage from './pages/FormPage';
import LeadsPage from './pages/LeadsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwt'));

  useEffect(() => {
    const onStorage = () => setIsAuthenticated(!!localStorage.getItem('jwt'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <Router>
      <>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/form" element={isAuthenticated ? <FormPage /> : <Navigate to="/login" />} />
        <Route path="/leads" element={isAuthenticated ? <LeadsPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
      </>
    </Router>
  )
}

export default App
