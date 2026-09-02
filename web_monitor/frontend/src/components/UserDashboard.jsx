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
  Info 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// --- MOCK CARE DATA FOR PATIENT VIEW ---
const MOCK_PRESCRIPTIONS = [
  {
    id: 1,
    name: 'Paracetamol 500 mg',
    dosage: '1 tablet',
    frequency: 'Twice a day',
    timing: 'After breakfast & dinner',
    duration: '5 days',
    status: 'Active',
    prescribedBy: 'Dr. Sarah',
    prescribedDate: '02 Sep 2026',
    nextDose: '08:00 PM'
  },
  {
    id: 2,
    name: 'Amoxicillin 250 mg',
    dosage: '1 capsule',
    frequency: 'Three times a day',
    timing: 'After meals',
    duration: '7 days',
    status: 'Active',
    prescribedBy: 'Dr. Sarah',
    prescribedDate: '01 Sep 2026',
    nextDose: '09:00 PM'
  },
  {
    id: 3,
    name: 'Atorvastatin 10 mg',
    dosage: '1 tablet',
    frequency: 'Once daily',
    timing: 'At bedtime',
    duration: '30 days',
    status: 'Completed',
    prescribedBy: 'Dr. Sarah',
    prescribedDate: '01 Aug 2026',
    nextDose: 'N/A'
  }
];

const MOCK_DIET_PLAN = {
  recommendedBy: 'Dr. Sarah',
  lastUpdated: '02 Sep 2026',
  meals: [
    {
      type: 'Breakfast',
      time: '08:00 AM - 09:00 AM',
      items: ['Oatmeal', 'Banana', 'Low-fat milk']
    },
    {
      type: 'Lunch',
      time: '01:00 PM - 02:00 PM',
      items: ['Brown rice', 'Dal', 'Vegetable curry', 'Salad']
    },
    {
      type: 'Evening Snack',
      time: '05:00 PM - 05:30 PM',
      items: ['Fresh fruit', 'Unsweetened beverage']
    },
    {
      type: 'Dinner',
      time: '08:00 PM - 09:00 PM',
      items: ['Chapati', 'Vegetable curry', 'Curd']
    }
  ]
};

const MOCK_DOCTOR_INSTRUCTIONS = {
  lastUpdated: '02 Sep 2026, 10:30 AM',
  prescribedBy: 'Dr. Sarah',
  instructions: [
    'Take prescribed medication according to the given schedule.',
    'Follow the recommended daily routine.',
    'Continue regular health monitoring.',
    'Maintain adequate rest and hydration.',
    'Contact your doctor/caregiver if you have concerns.'
  ],
  careNotes: 'Continue monitoring regularly and follow the prescribed care plan.'
};

// --- REUSABLE CARE COMPONENTS ---
function PrescriptionCard({ rx }) {
  const isActive = rx.status === 'Active';
  return (
    <div className="rx-card">
      <div className="rx-card-header">
        <span className="rx-name">{rx.name}</span>
        <span className={`rx-status-badge ${isActive ? 'active' : 'completed'}`}>
          {rx.status}
        </span>
      </div>
      <div className="rx-details">
        <div className="rx-detail-item">
          <span className="rx-label">Dosage</span>
          <span className="rx-value">{rx.dosage}</span>
        </div>
        <div className="rx-detail-item">
          <span className="rx-label">Frequency</span>
          <span className="rx-value">{rx.frequency}</span>
        </div>
        <div className="rx-detail-item">
          <span className="rx-label">Timing</span>
          <span className="rx-value">{rx.timing}</span>
        </div>
        <div className="rx-detail-item">
          <span className="rx-label">Duration</span>
          <span className="rx-value">{rx.duration}</span>
        </div>
      </div>
      <div className="rx-footer">
        <span>Prescribed by {rx.prescribedBy} ({rx.prescribedDate})</span>
        <span className="rx-next-dose">
          <Clock size={14} /> Next: {rx.nextDose}
        </span>
      </div>
    </div>
  );
}

function DietPlan({ diet }) {
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
          Prepared by {diet.recommendedBy} • Updated {diet.lastUpdated}
        </span>
      </div>
      <div className="diet-grid">
        {diet.meals.map((meal, index) => (
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
              {meal.items.map((item, idx) => (
                <li key={idx} className="meal-item">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function DoctorInstructions({ data }) {
  return (
    <section className="care-section-card">
      <div className="care-section-header">
        <div className="care-section-title-group">
          <FileText size={22} color="var(--primary)" />
          <h3>DOCTOR'S INSTRUCTIONS & CARE NOTES</h3>
        </div>
        <span className="care-section-badge">
          Last updated: {data.lastUpdated}
        </span>
      </div>
      <div className="instructions-container">
        <div className="instructions-list-wrapper">
          <h4>DOCTOR'S INSTRUCTIONS</h4>
          <ul className="instructions-list">
            {data.instructions.map((inst, index) => (
              <li key={index} className="instruction-item">
                <CheckCircle2 size={18} className="instruction-icon" />
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="care-notes-card">
          <div>
            <div className="care-notes-header">
              <Info size={18} color="var(--primary)" />
              <span>CARE NOTES</span>
            </div>
            <p className="care-notes-content">
              "{data.careNotes}"
            </p>
          </div>
          <div className="care-notes-footer">
            <span>Prescribed by: <strong>{data.prescribedBy}</strong></span>
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
  hasReceivedData = false
}) {
  const isPanic = data.panic === 1 || data.panic === true;
  const isLive = isConnected && hasReceivedData && data.hr !== null;

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
              color={isPanic ? 'var(--alert)' : 'var(--accent)'} 
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
            Read-Only • Prescribed by Care Physician
          </span>
        </div>
        <div className="prescriptions-grid">
          {MOCK_PRESCRIPTIONS.map((rx) => (
            <PrescriptionCard key={rx.id} rx={rx} />
          ))}
        </div>
      </section>

      {/* SECTION 5 — MY DIET PLAN */}
      <DietPlan diet={MOCK_DIET_PLAN} />

      {/* SECTION 6 — DOCTOR'S INSTRUCTIONS & CARE NOTES */}
      <DoctorInstructions data={MOCK_DOCTOR_INSTRUCTIONS} />
    </main>
  );
}

