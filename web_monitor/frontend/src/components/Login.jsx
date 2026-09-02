import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivitySquare, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formBody = new URLSearchParams({ username, password });
      const response = await fetch('/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString()
      });
      if (!response.ok) {
         setError('Invalid credentials');
         return;
      }
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('email', username);
      setAuth({ token: data.access_token, role: data.role, email: username });
      navigate('/');
    } catch (err) {
      setError('Connection to server failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
           <ActivitySquare size={48} color="var(--accent)" />
           <h2>C.A.R.E. Access</h2>
           <p>Sign in to your account</p>
        </div>
        
        {error && (
          <div className="login-error">
             <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="Email address"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '2.75rem' }}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="login-button">Sign In</button>
        </form>

        <div className="login-hint">
          <strong>Demo Accounts:</strong><br/>
          user@care.com<br/>
          admin@care.com<br/>
          doctor@care.com<br/>
          <span style={{fontSize: '0.8rem', opacity: 0.8}}>(Password: password)</span>
        </div>
      </div>
    </div>
  );
}
