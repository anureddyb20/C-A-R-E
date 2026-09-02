import { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  ActivitySquare, 
  CheckCircle2, 
  AlertCircle, 
  WifiOff, 
  Pill, 
  Utensils, 
  FileText, 
  Clock, 
  Coffee, 
  Sun, 
  Sunset, 
  Moon, 
  Info,
  UserCheck 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getCarePlanForPatient, subscribeCarePlan } from '../utils/carePlanStore';

// --- REUSABLE CARE COMPONENTS ---
function PrescriptionCard({ rx }) {
  const isActive = rx.status === 'Active';
  const name = rx.medicineName || rx.name || 'Medication';
  return (
    <div className="rx-card">
      <div className="rx-card-header">
        <span className="rx-name">{name}</span>
        <span className={`rx-status-badge ${isActive ? 'active' : 'completed'}`}>
          {rx.status || 'Active'}
        </span>
      </div>
      <div className="rx-details">
        <div className="rx-detail-item">
          <span className="rx-label">Dosage</span>
          <span className="rx-value">{rx.dosage || '--'}</span>
        </div>
        <div className="rx-detail-item">
          <span className="rx-label">Frequency</span>
          <span className="rx-value">{rx.frequency || '--'}</span>
        </div>
        <div className="rx-detail-item">
          <span className="rx-label">Timing</span>
          <span className="rx-value">{rx.timing || '--'}</span>
        </div>
        <div className="rx-detail-item">
          <span className="rx-label">Duration</span>
          <span className="rx-value">{rx.duration || '--'}</span>
        </div>
      </div>
      <div className="rx-footer">
        <span>Prescribed by {rx.prescribedBy || 'Dr. Sarah'} ({rx.prescribedDate || 'Recent'})</span>
        <span className="rx-next-dose">
          <Clock size={14} /> Next: {rx.nextDose || 'Scheduled'}
        </span>
      </div>
    </div>
  );
}

function DietPlan({ dietPlan, lastUpdated }) {
  const meals = [
    { type: 'Breakfast', time: '08:00 AM - 09:00 AM', items: dietPlan?.breakfast || [] },
    { type: 'Lunch', time: '01:00 PM - 02:00 PM', items: dietPlan?.lunch || [] },
    { type: 'Evening Snack', time: '05:00 PM - 05:30 PM', items: dietPlan?.eveningSnack || [] },
    { type: 'Dinner', time: '08:00 PM - 09:00 PM', items: dietPlan?.dinner || [] }
  ];

  const getMealIcon = (type) => {
    switch (type) {
      case 'Breakfast': return <Coffee size={18} />;
      case 'Lunch': return <Sun size={18} />;
      case 'Evening Snack': return <Sunset size={18} />;
      case 'Dinner': return <Moon size={18} />;
      default: return <Utensils size={18} />;
    }
  };

  return (
    <section className="care-section-card">
      <div className="care-section-header">
        <div className="care-section-title-group">
          <Utensils size={22} color="var(--primary)" />
          <h3>MY DIET PLAN</h3>
        </div>
        <span className="care-section-badge">
          Prepared by Dr. Sarah • Updated {lastUpdated || 'Recently'}
        </span>
      </div>
      <div className="diet-grid">
        {meals.map((meal, index) => (
          <div key={index} className="meal-card">
            <div className="meal-header">
              <div className="meal-icon">
                {getMealIcon(meal.type)}
              </div>
              <div>
                <div className="meal-title">{meal.type}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{meal.time}</div>
              </div>
            </div>
            <ul className="meal-items">
              {meal.items.length > 0 ? (
                meal.items.map((item, idx) => (
                  <li key={idx} className="meal-item">{item}</li>
                ))
              ) : (
                <li className="meal-item" style={{ fontStyle: 'italic', opacity: 0.6 }}>No specific items</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function DoctorInstructions({ instructions = [], careNotes = '', lastUpdated = '' }) {
  return (
    <section className="care-section-card">
      <div className="care-section-header">
        <div className="care-section-title-group">
          <FileText size={22} color="var(--primary)" />
          <h3>DOCTOR'S INSTRUCTIONS & CARE NOTES</h3>
        </div>
        <span className="care-section-badge">
          Last updated: {lastUpdated || 'Recently'}
        </span>
      </div>
      <div className="instructions-container">
        <div className="instructions-list-wrapper">
          <h4>DOCTOR'S INSTRUCTIONS</h4>
          {instructions.length > 0 ? (
            <ul className="instructions-list">
              {instructions.map((inst, index) => (
                <li key={index} className="instruction-item">
                  <CheckCircle2 size={18} className="instruction-icon" />
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No general instructions listed at this time.
            </p>
          )}
        </div>
        <div className="care-notes-card">
          <div>
            <div className="care-notes-header">
              <Info size={18} color="var(--primary)" />
              <span>CARE NOTES</span>
            </div>
            <p className="care-notes-content">
              {careNotes ? `"${careNotes}"` : 'No additional care notes recorded.'}
            </p>
          </div>
          <div className="care-notes-footer">
            <span>Prescribed by: <strong>Dr. Sarah</strong></span>
            <span>Read-Only Patient View</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function UserDashboard({ 
  data = { hr: null, gsr: null, panic: 0 }, 
  chartData = [], 
  isConnected = false,
  connectionStatus = 'disconnected',
  hasReceivedData = false,
  selectedPatientId = 1
}) {
  const [activePatientId, setActivePatientId] = useState(selectedPatientId);
  const [carePlan, setCarePlan] = useState(() => getCarePlanForPatient(activePatientId));

  const isPanic = data.panic === 1 || data.panic === true;
  const isLive = isConnected && hasReceivedData && data.hr !== null;

  // Sync care plan when active patient changes or when store updates
  useEffect(() => {
    setCarePlan(getCarePlanForPatient(activePatientId));
  }, [activePatientId]);

  useEffect(() => {
    const unsubscribe = subscribeCarePlan(() => {
      setCarePlan(getCarePlanForPatient(activePatientId));
    });
    return unsubscribe;
  }, [activePatientId]);

  // Determine current monitoring status
  const getMonitoringStatus = () => {
    if (isPanic) {
      return {
        level: 'emergency',
        title: 'EMERGENCY',
        description: 'Panic signal detected — immediate caregiver attention required',
        icon: <AlertTriangle size={24} className="status-icon emergency" />
      };
    }
    if (!isLive) {
      return {
        level: 'offline',
        title: 'OFFLINE / AWAITING DATA',
        description: 'Waiting for live telemetry stream from C.A.R.E. edge gateway...',
        icon: <WifiOff size={24} className="status-icon offline" />
      };
    }
    // Simple physiological indicator (e.g. HR > 100 or HR < 50)
    if (data.hr > 100 || data.hr < 50) {
      return {
        level: 'attention',
        title: 'ATTENTION',
        description: 'Elevated or irregular heart rate reading detected',
        icon: <AlertCircle size={24} className="status-icon attention" />
      };
    }
    return {
      level: 'stable',
      title: 'STABLE',
      description: 'Continuous monitoring active — telemetry within expected range',
      icon: <CheckCircle2 size={24} className="status-icon stable" />
    };
  };

  const currentStatus = getMonitoringStatus();

  // Helper for GSR qualitative indicator (neutral descriptor)
  const getStressDescriptor = (gsr) => {
    if (gsr === null || !isLive) return 'Waiting for data';
    if (gsr > 520) return 'Elevated stress response';
    if (gsr < 480) return 'Resting / Low stress';
    return 'Moderate stress response';
  };

  return (
    <main className="dashboard user-dashboard">
      {/* DEMO PATIENT PROFILE SWITCHER FOR VERIFICATION */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        backgroundColor: 'var(--surface-card)',
        padding: '0.75rem 1.25rem',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>
          <UserCheck size={18} />
          <span>Patient Profile: {carePlan.patientName || `Patient #${activePatientId}`}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>View Care Plan For:</span>
          <button 
            className={`doc-btn-sm ${activePatientId === 1 ? 'edit' : ''}`} 
            onClick={() => setActivePatientId(1)}
            style={{ fontWeight: activePatientId === 1 ? 700 : 500 }}
          >
            John Doe
          </button>
          <button 
            className={`doc-btn-sm ${activePatientId === 2 ? 'edit' : ''}`} 
            onClick={() => setActivePatientId(2)}
            style={{ fontWeight: activePatientId === 2 ? 700 : 500 }}
          >
            Jane Smith
          </button>
          <button 
            className={`doc-btn-sm ${activePatientId === 3 ? 'edit' : ''}`} 
            onClick={() => setActivePatientId(3)}
            style={{ fontWeight: activePatientId === 3 ? 700 : 500 }}
          >
            Robert Johnson
          </button>
        </div>
      </div>

      {/* SECTION 6 — EMERGENCY / PANIC ALERT BANNER */}
      {isPanic && (
        <section className="panic-banner" role="alert" aria-live="assertive">
          <div className="panic-banner-content">
            <AlertTriangle size={36} className="panic-icon" />
            <div>
              <div className="panic-title">EMERGENCY ALERT</div>
              <div className="panic-subtitle">
                Panic signal detected. Immediate caregiver attention required.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5 — CURRENT HEALTH STATUS */}
      <section className={`health-status-card status-${currentStatus.level}`}>
        <div className="health-status-header">
          <div className="status-title-group">
            {currentStatus.icon}
            <div>
              <span className="health-status-label">CURRENT STATUS</span>
              <h2 className="health-status-value">{currentStatus.title}</h2>
            </div>
          </div>
          <span className="monitoring-tag">Monitoring Status • Non-Diagnostic</span>
        </div>
        <p className="health-status-description">{currentStatus.description}</p>
      </section>

      {/* METRICS GRID: HEART RATE & STRESS INDEX */}
      <section className="stats-grid">
        {/* SECTION 1 — HEART RATE */}
        <div className={`stat-card ${isPanic ? 'card-panic' : ''}`}>
          <div className={`stat-icon ${isPanic ? 'alert' : ''}`}>
            <Heart size={32} className={isLive ? 'pulse-heart' : ''} />
          </div>
          <div className="stat-info">
            <span className="stat-label">HEART RATE</span>
            <div className="stat-value-container">
              {isLive ? (
                <span className="stat-value">
                  {data.hr} <span className="stat-unit">BPM</span>
                </span>
              ) : (
                <span className="stat-value stat-muted">
                  -- <span className="stat-unit">BPM</span>
                </span>
              )}
            </div>
            <span className="stat-subtext">
              {isLive ? 'Live telemetry' : 'Waiting for live data'}
            </span>
          </div>
        </div>

        {/* SECTION 2 — STRESS INDEX */}
        <div className={`stat-card ${isPanic ? 'card-panic' : ''}`}>
          <div className={`stat-icon ${isPanic ? 'alert' : ''}`}>
            <Activity size={32} />
          </div>
          <div className="stat-info">
            <span className="stat-label">STRESS INDEX</span>
            <div className="stat-value-container">
              {isLive ? (
                <span className="stat-value">{data.gsr}</span>
              ) : (
                <span className="stat-value stat-muted">--</span>
              )}
            </div>
            <span className="stat-subtext">
              {getStressDescriptor(data.gsr)}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3 — LIVE ECG WAVEFORM */}
      <section className="chart-container">
        <div className="chart-header">
          <div className="chart-title">
            <ActivitySquare 
              size={22} 
              color={isPanic ? '#E11D48' : '#0EA5E9'} 
            />
            <span>Live ECG Waveform</span>
          </div>
          <div className="chart-badge">
            <div className={`status-dot ${isLive ? 'connected' : 'disconnected'}`}></div>
            <span>{isLive ? 'Real-time Signal' : 'Awaiting Signal'}</span>
          </div>
        </div>

        <div className="chart-wrapper">
          {chartData.length > 0 && isLive ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="time" hide={true} />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="var(--text-muted)" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="ecg" 
                  stroke={isPanic ? '#E11D48' : '#0EA5E9'} 
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-placeholder">
              <ActivitySquare size={48} className="placeholder-icon" />
              <p className="placeholder-title">Waiting for live ECG data...</p>
              <span className="placeholder-hint">
                Ensure C.A.R.E. wearable and gateway are powered and transmitting.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4 — MY PRESCRIPTIONS */}
      <section className="care-section-card">
        <div className="care-section-header">
          <div className="care-section-title-group">
            <Pill size={22} color="var(--primary)" />
            <h3>MY PRESCRIPTIONS</h3>
          </div>
          <span className="care-section-badge">
            Read-Only • Prescribed by Dr. Sarah
          </span>
        </div>
        {carePlan.prescriptions && carePlan.prescriptions.length > 0 ? (
          <div className="prescriptions-grid">
            {carePlan.prescriptions.map((rx) => (
              <PrescriptionCard key={rx.id} rx={rx} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
            No active prescriptions on file.
          </p>
        )}
      </section>

      {/* SECTION 5 — MY DIET PLAN */}
      <DietPlan dietPlan={carePlan.dietPlan} lastUpdated={carePlan.lastUpdated} />

      {/* SECTION 6 — DOCTOR'S INSTRUCTIONS & CARE NOTES */}
      <DoctorInstructions 
        instructions={carePlan.doctorInstructions} 
        careNotes={carePlan.careNotes} 
        lastUpdated={carePlan.lastUpdated} 
      />
    </main>
  );
}
