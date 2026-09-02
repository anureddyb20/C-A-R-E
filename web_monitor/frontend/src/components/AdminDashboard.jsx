import { useState } from 'react';
import { Server, Users, Database, ShieldAlert, Activity, CheckCircle } from 'lucide-react';

export default function AdminDashboard({ isConnected }) {
  const [users, setUsers] = useState([
    { id: 1, email: "user@care.com", role: "User", lastLogin: "2 mins ago", status: "Online" },
    { id: 2, email: "admin@care.com", role: "Admin", lastLogin: "Just now", status: "Online" },
    { id: 3, email: "doctor@care.com", role: "Doctor", lastLogin: "1 hr ago", status: "Offline" },
    { id: 4, email: "j.doe@care.com", role: "User", lastLogin: "Yesterday", status: "Offline" }
  ]);

  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [editingId, setEditingId] = useState(null);

  const handleToggleDisable = (id, email, currentStatus) => {
    if (currentStatus === 'Disabled') {
      setUsers(users.map(u => u.id === id ? { ...u, status: 'Offline' } : u));
      showToast(`Account ${email} enabled.`);
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, status: 'Disabled' } : u));
      showToast(`Account ${email} disabled.`);
    }
  };

  const handleToggleEdit = (id, email) => {
    if (editingId === id) {
      setEditingId(null);
      showToast(`Changes saved for ${email}`);
    } else {
      setEditingId(id);
      showToast(`Editing ${email}...`);
    }
  };

  return (
    <main className="dashboard admin-main">
      {toast && (
        <div className="toast-notification">
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      <div className="admin-header-section">
        <h2><ShieldAlert size={24} style={{verticalAlign: 'middle', marginRight: '8px'}}/> System Administration</h2>
        <p>Manage users, view system health, and configure global settings.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Server size={32} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Backend Status</span>
            <span className="stat-value" style={{color: 'var(--success)', fontSize: '1.5rem'}}>Healthy</span>
          </div>
        </div>

        <div className="stat-card">
          <div className={`stat-icon ${!isConnected ? 'alert' : ''}`}>
            <Activity size={32} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Device Connections</span>
            <span className="stat-value" style={{fontSize: '1.5rem'}}>{isConnected ? '1 Active' : '0 Active'}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Database size={32} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Database Usage</span>
            <span className="stat-value" style={{fontSize: '1.5rem'}}>12%</span>
          </div>
        </div>
      </div>

      <div className="admin-panel user-management">
        <h3><Users size={18} style={{verticalAlign: 'middle', marginRight: '8px'}}/> User Management</h3>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td><span className={`role-tag role-${u.role.toLowerCase()}`}>{u.role}</span></td>
                  <td>{u.lastLogin}</td>
                  <td>
                  <span className={`status-indicator ${u.status === 'Online' ? 'online' : u.status === 'Disabled' ? 'disabled' : 'offline'}`}></span>
                  {u.status}
                </td>
                <td>
                  <button 
                    className="table-btn" 
                    onClick={() => handleToggleEdit(u.id, u.email)}
                    style={{ backgroundColor: editingId === u.id ? 'var(--surface-light)' : 'transparent' }}
                  >
                    {editingId === u.id ? 'Done' : 'Edit'}
                  </button>
                  <button 
                    className={`table-btn ${u.status === 'Disabled' ? 'success' : 'danger'}`} 
                    onClick={() => handleToggleDisable(u.id, u.email, u.status)}
                  >
                    {u.status === 'Disabled' ? 'Enable' : 'Disable'}
                  </button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
