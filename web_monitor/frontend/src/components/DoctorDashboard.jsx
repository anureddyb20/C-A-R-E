import { useState, useEffect } from 'react';
import { Heart, Activity, AlertTriangle, ActivitySquare, Users, FileText, Settings, User as UserIcon, CheckCircle, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function DoctorDashboard({ data, chartData }) {
  const isPanic = data.panic === 1;
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/patients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        let fetchedPatients = await response.json();
        setPatients(fetchedPatients);
        if (fetchedPatients.length > 0 && !selectedPatient) {
          setSelectedPatient(fetchedPatients[0].id);
        }
      } else {
        const mockPatients = [
          { id: 1, name: "John Doe", status: "Stable", room: "101" },
          { id: 2, name: "Jane Smith", status: "Stable", room: "102" },
          { id: 3, name: "Robert Johnson", status: "Observation", room: "204" }
        ];
        setPatients(mockPatients);
        if (!selectedPatient) setSelectedPatient(1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newName || !newRoom) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/patients', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName, room: newRoom, status: 'Observation' })
      });
      if (response.ok) {
        const newPatient = await response.json();
        setPatients([...patients, newPatient]);
        setSelectedPatient(newPatient.id);
        setIsAdding(false);
        setNewName('');
        setNewRoom('');
        showToast("Patient added successfully.");
      }
    } catch (e) {
      console.error(e);
      const newPatient = { id: Date.now(), name: newName, room: newRoom, status: 'Observation' };
      setPatients([...patients, newPatient]);
      setSelectedPatient(newPatient.id);
      setIsAdding(false);
      setNewName('');
      setNewRoom('');
      showToast("Patient added (offline mode).");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const displayPatients = patients.map(p => {
    if (p.id === selectedPatient && isPanic) {
      return { ...p, status: "Critical" };
    }
    return p;
  });

  const selectedPatientData = displayPatients.find(p => p.id === selectedPatient);

  return (
    <div className="doctor-layout">
      <aside className="clinical-sidebar">
        <h3 className="sidebar-title"><Users size={18} style={{marginRight: '8px'}} /> My Patients</h3>
        <ul className="patient-list">
          {displayPatients.map(p => (
            <li 
              key={p.id} 
              className={`patient-item ${selectedPatient === p.id ? 'active' : ''}`}
              onClick={() => setSelectedPatient(p.id)}
            >
              <div className="patient-name">{p.name} <span className="patient-room">Rm {p.room}</span></div>
              <div className={`patient-status ${p.status.toLowerCase()}`}>{p.status}</div>
            </li>
          ))}
        </ul>

        {!isAdding ? (
          <button className="add-patient-btn" onClick={() => setIsAdding(true)}>
            <Plus size={16} /> Add Patient
          </button>
        ) : (
          <form className="add-patient-form" onSubmit={handleAddPatient}>
            <input 
              type="text" 
              placeholder="Patient Name" 
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              autoFocus 
            />
            <input 
              type="text" 
              placeholder="Room Number" 
              value={newRoom} 
              onChange={e => setNewRoom(e.target.value)} 
            />
            <div className="btn-row">
              <button type="submit" className="btn-save">Save</button>
              <button type="button" className="btn-cancel" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </form>
        )}
      </aside>

      <main className="dashboard clinical-main">
        {toast && (
          <div className="toast-notification">
            <CheckCircle size={18} /> {toast}
          </div>
        )}
        
        {selectedPatientData ? (
          <>
            <div className="clinical-header">
              <h2>Patient: {selectedPatientData.name}</h2>
              <div className="clinical-actions">
                <button className="clinical-btn" onClick={() => showToast("Loading medical history...")}><FileText size={16} /> View History</button>
                <button className="clinical-btn" onClick={() => showToast("Opening threshold settings...")}><Settings size={16} /> Adjust Thresholds</button>
              </div>
            </div>

            {selectedPatientData.status === "Critical" && (
              <div className="panic-banner">
                <AlertTriangle size={32} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
                EMERGENCY: PATIENT PANIC BUTTON PRESSED
              </div>
            )}

            <div className="stats-grid">
              <div className="stat-card">
                <div className={`stat-icon ${selectedPatientData.status === "Critical" ? 'alert' : ''}`}>
                  <Heart size={32} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Heart Rate (Live)</span>
                  <span className="stat-value">{data.hr} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>BPM</span></span>
                </div>
              </div>

              <div className="stat-card">
                <div className={`stat-icon ${selectedPatientData.status === "Critical" ? 'alert' : ''}`}>
                  <Activity size={32} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Stress Index (Live)</span>
                  <span className="stat-value">{data.gsr}</span>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">
                  <ActivitySquare size={20} className={selectedPatientData.status === "Critical" ? 'text-alert' : 'text-accent'} color={selectedPatientData.status === "Critical" ? 'var(--alert)' : 'var(--accent)'} />
                  Live ECG Waveform - {selectedPatientData.name}
                </div>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="time" hide={true} />
                    <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                    <Line 
                      type="monotone" 
                      dataKey="ecg" 
                      stroke={selectedPatientData.status === "Critical" ? 'var(--alert)' : 'var(--accent)'} 
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="clinical-notes-panel">
               <h3><FileText size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/> Clinical Notes</h3>
               <textarea className="notes-textarea" placeholder={`Add session observations for ${selectedPatientData.name}...`}></textarea>
               <button className="save-notes-btn" onClick={() => showToast("Notes saved successfully.")}>Save Notes</button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <UserIcon size={64} style={{color: 'var(--surface-light)', margin: '0 auto 1rem auto'}} />
            <h2>No Patient Selected</h2>
            <p>Select a patient from the sidebar or add a new one.</p>
          </div>
        )}
      </main>
    </div>
  );
}
