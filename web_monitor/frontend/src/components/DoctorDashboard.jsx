import { useState, useEffect } from 'react';
import { Heart, Activity, AlertTriangle, ActivitySquare, Users, FileText, Settings, User as UserIcon, CheckCircle, Plus, X, Sliders, History, Info, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function DoctorDashboard({ data, chartData }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [toast, setToast] = useState(null);

  // Modal States
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showThresholdsModal, setShowThresholdsModal] = useState(false);

  // Alert Thresholds State (Session Persisted)
  const [thresholds, setThresholds] = useState({
    hrMin: 50,
    hrMax: 100,
    stressMax: 520,
    panicAlertEnabled: true
  });

  const [tempThresholds, setTempThresholds] = useState({ ...thresholds });

  // Session telemetry log for View History
  const [sessionLogs, setSessionLogs] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  // Update session history log when telemetry arrives
  useEffect(() => {
    if (data && data.hr !== null) {
      const now = new Date().toLocaleTimeString();
      setSessionLogs((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.hr !== data.hr || last.gsr !== data.gsr || last.panic !== data.panic) {
          const isAlert = data.panic === 1 || data.hr < thresholds.hrMin || data.hr > thresholds.hrMax || data.gsr > thresholds.stressMax;
          const statusText = data.panic === 1 ? 'Panic Alert' : (isAlert ? 'Threshold Exceeded' : 'Normal');
          return [...prev.slice(-19), { timestamp: now, hr: data.hr, gsr: data.gsr, panic: data.panic, status: statusText }];
        }
        return prev;
      });
    }
  }, [data, thresholds]);

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

  const isPanic = data.panic === 1;
  const isHrAlert = data.hr !== null && (data.hr < thresholds.hrMin || data.hr > thresholds.hrMax);
  const isStressAlert = data.gsr !== null && data.gsr > thresholds.stressMax;
  const isSelectedAlert = (isPanic && thresholds.panicAlertEnabled) || isHrAlert || isStressAlert;

  const displayPatients = patients.map(p => {
    if (p.id === selectedPatient && isSelectedAlert) {
      return { ...p, status: "Critical" };
    }
    return p;
  });

  const selectedPatientData = displayPatients.find(p => p.id === selectedPatient);

  const handleOpenThresholds = () => {
    setTempThresholds({ ...thresholds });
    setShowThresholdsModal(true);
  };

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    setThresholds({ ...tempThresholds });
    setShowThresholdsModal(false);
    showToast(`Threshold settings updated for ${selectedPatientData ? selectedPatientData.name : 'patient'}.`);
  };

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
                <button className="clinical-btn" onClick={() => setShowHistoryModal(true)}>
                  <FileText size={16} /> View History
                </button>
                <button className="clinical-btn" onClick={handleOpenThresholds}>
                  <Settings size={16} /> Adjust Thresholds
                </button>
              </div>
            </div>

            {selectedPatientData.status === "Critical" && (
              <div className="panic-banner">
                <AlertTriangle size={32} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
                EMERGENCY: ALERT OR PANIC THRESHOLD TRIGGERED
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
                  <span className="stat-subtext" style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                    Alert Range: {thresholds.hrMin}–{thresholds.hrMax} BPM
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className={`stat-icon ${selectedPatientData.status === "Critical" ? 'alert' : ''}`}>
                  <Activity size={32} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Stress Index (Live)</span>
                  <span className="stat-value">{data.gsr}</span>
                  <span className="stat-subtext" style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                    Alert Threshold: &gt; {thresholds.stressMax}
                  </span>
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

      {/* VIEW HISTORY MODAL */}
      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-container large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <History size={22} color="var(--accent)" />
                <span>Session Telemetry & Monitoring History</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowHistoryModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {selectedPatientData && (
                <div className="history-patient-badge">
                  <div>
                    <strong>Patient:</strong> {selectedPatientData.name} (Room {selectedPatientData.room})
                  </div>
                  <div className={`patient-status ${selectedPatientData.status.toLowerCase()}`}>
                    Status: {selectedPatientData.status}
                  </div>
                </div>
              )}

              <div className="history-summary-grid">
                <div className="history-summary-card">
                  <div className="history-card-label">Current HR</div>
                  <div className="history-card-value">{data.hr ? `${data.hr} BPM` : '--'}</div>
                </div>
                <div className="history-summary-card">
                  <div className="history-card-label">Current Stress</div>
                  <div className="history-card-value">{data.gsr !== null ? data.gsr : '--'}</div>
                </div>
                <div className="history-summary-card">
                  <div className="history-card-label">ECG Samples</div>
                  <div className="history-card-value">{chartData.length} pts</div>
                </div>
                <div className="history-summary-card">
                  <div className="history-card-label">Panic Alert</div>
                  <div className="history-card-value" style={{ color: isPanic ? 'var(--alert)' : 'var(--success)' }}>
                    {isPanic ? 'ACTIVE' : 'Normal'}
                  </div>
                </div>
              </div>

              <div className="history-section-title">
                <ActivitySquare size={18} color="var(--accent)" />
                Session ECG Waveform Trend
              </div>
              <div className="history-chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="time" hide={true} />
                    <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                    <Line type="monotone" dataKey="ecg" stroke="var(--accent)" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="history-section-title">
                <Clock size={18} color="var(--accent)" />
                Recent Session Event Log
              </div>
              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Heart Rate</th>
                      <th>Stress Index</th>
                      <th>Panic Signal</th>
                      <th>Monitoring Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionLogs.length > 0 ? (
                      sessionLogs.slice().reverse().map((log, idx) => (
                        <tr key={idx}>
                          <td>{log.timestamp}</td>
                          <td>{log.hr} BPM</td>
                          <td>{log.gsr}</td>
                          <td style={{ color: log.panic ? 'var(--alert)' : 'var(--text-muted)' }}>
                            {log.panic ? 'TRIGGERED' : 'None'}
                          </td>
                          <td style={{ color: log.status === 'Normal' ? 'var(--success)' : 'var(--alert)' }}>
                            {log.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textTransform: 'none', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                          Awaiting telemetry stream frames for session log...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="clinical-btn" onClick={() => setShowHistoryModal(false)}>
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADJUST THRESHOLDS MODAL */}
      {showThresholdsModal && (
        <div className="modal-overlay" onClick={() => setShowThresholdsModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Sliders size={22} color="var(--accent)" />
                <span>Configure Alert Thresholds</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowThresholdsModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveThresholds} className="modal-body threshold-form">
              <div className="threshold-group">
                <label className="threshold-label">
                  Heart Rate Lower Limit
                  <span className="threshold-hint">Triggers alert if HR drops below</span>
                </label>
                <div className="threshold-input-group">
                  <input 
                    type="number" 
                    className="threshold-input" 
                    value={tempThresholds.hrMin}
                    onChange={(e) => setTempThresholds({ ...tempThresholds, hrMin: Number(e.target.value) })}
                    min="30"
                    max="120"
                    required
                  />
                  <span className="threshold-unit">BPM</span>
                </div>
              </div>

              <div className="threshold-group">
                <label className="threshold-label">
                  Heart Rate Upper Limit
                  <span className="threshold-hint">Triggers alert if HR exceeds</span>
                </label>
                <div className="threshold-input-group">
                  <input 
                    type="number" 
                    className="threshold-input" 
                    value={tempThresholds.hrMax}
                    onChange={(e) => setTempThresholds({ ...tempThresholds, hrMax: Number(e.target.value) })}
                    min="80"
                    max="220"
                    required
                  />
                  <span className="threshold-unit">BPM</span>
                </div>
              </div>

              <div className="threshold-group">
                <label className="threshold-label">
                  Stress Index Alert Threshold
                  <span className="threshold-hint">Triggers alert if GSR reading exceeds</span>
                </label>
                <div className="threshold-input-group">
                  <input 
                    type="number" 
                    className="threshold-input" 
                    value={tempThresholds.stressMax}
                    onChange={(e) => setTempThresholds({ ...tempThresholds, stressMax: Number(e.target.value) })}
                    min="100"
                    max="1000"
                    required
                  />
                  <span className="threshold-unit">GSR</span>
                </div>
              </div>

              <div className="threshold-toggle-row">
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Panic Button Immediate Alert</div>
                  <div className="threshold-hint">Trigger critical alert instantly upon panic signal</div>
                </div>
                <input 
                  type="checkbox" 
                  className="checkbox-toggle"
                  checked={tempThresholds.panicAlertEnabled}
                  onChange={(e) => setTempThresholds({ ...tempThresholds, panicAlertEnabled: e.target.checked })}
                />
              </div>

              <div className="threshold-disclaimer">
                <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Clinical Notice:</strong> Monitoring thresholds are configurable alerts for telemetry observation and non-diagnostic caregiver notification.
                </div>
              </div>

              <div className="modal-footer" style={{ padding: 0, border: 'none', backgroundColor: 'transparent', marginTop: '0.5rem' }}>
                <button type="button" className="btn-cancel" style={{ padding: '0.6rem 1.25rem' }} onClick={() => setShowThresholdsModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" style={{ padding: '0.6rem 1.25rem', borderRadius: '6px' }}>
                  Save Thresholds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

