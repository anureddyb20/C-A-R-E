import { ActivitySquare, LogOut, User as UserIcon } from 'lucide-react';

export default function SharedHeader({ auth, setAuth, isConnected, navigate }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setAuth(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <h1>
        <ActivitySquare size={28} />
        C.A.R.E. Web Monitor
      </h1>
      
      <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <div className="role-badge">
           <UserIcon size={16} />
           {auth.role}
        </div>
        <div className="status-badge">
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          {isConnected ? 'Live Data' : 'Connecting...'}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
           <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
}
