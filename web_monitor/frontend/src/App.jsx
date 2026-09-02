import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import SharedHeader from './components/SharedHeader';
import UserDashboard from './components/UserDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { useECGData } from './hooks/useECGData';
import './index.css';

function DashboardRouter({ auth, setAuth }) {
  const { data, chartData, isConnected, connectionStatus, hasReceivedData } = useECGData();
  const navigate = useNavigate();

  return (
    <div className={`app-container ${data.panic === 1 && auth.role !== 'Admin' ? 'panic-mode' : ''}`}>
      <SharedHeader 
        auth={auth} 
        setAuth={setAuth} 
        isConnected={isConnected} 
        connectionStatus={connectionStatus}
        navigate={navigate} 
      />
      
      {auth.role === 'Admin' && <AdminDashboard isConnected={isConnected} />}
      {auth.role === 'Doctor' && <DoctorDashboard data={data} chartData={chartData} />}
      {(auth.role === 'User' || !['Admin', 'Doctor'].includes(auth.role)) && (
        <UserDashboard 
          data={data} 
          chartData={chartData} 
          isConnected={isConnected}
          connectionStatus={connectionStatus}
          hasReceivedData={hasReceivedData}
        />
      )}
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    return token ? { token, role, email } : null;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          auth ? <Navigate to="/" /> : <Login setAuth={setAuth} />
        } />
        <Route path="/" element={
          auth ? <DashboardRouter auth={auth} setAuth={setAuth} /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
