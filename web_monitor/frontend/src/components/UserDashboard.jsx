import { Heart, Activity, AlertTriangle, ActivitySquare, CheckCircle2, AlertCircle, WifiOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
                <XAxis dataKey="time" hide={true} />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="var(--text-muted)" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="ecg" 
                  stroke={isPanic ? 'var(--alert)' : 'var(--accent)'} 
                  strokeWidth={2.5}
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
    </main>
  );
}
