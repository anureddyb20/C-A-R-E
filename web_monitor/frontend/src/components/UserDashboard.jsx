import { Heart, Activity, AlertTriangle, ActivitySquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function UserDashboard({ data, chartData }) {
  const isPanic = data.panic === 1;

  return (
    <main className="dashboard">
      {isPanic && (
        <div className="panic-banner">
          <AlertTriangle size={32} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
          EMERGENCY: PANIC BUTTON PRESSED
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className={`stat-icon ${isPanic ? 'alert' : ''}`}>
            <Heart size={32} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Heart Rate</span>
            <span className="stat-value">{data.hr} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>BPM</span></span>
          </div>
        </div>

        <div className="stat-card">
          <div className={`stat-icon ${isPanic ? 'alert' : ''}`}>
            <Activity size={32} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Stress Index</span>
            <span className="stat-value">{data.gsr}</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">
            <ActivitySquare size={20} className={isPanic ? 'text-alert' : 'text-accent'} color={isPanic ? 'var(--alert)' : 'var(--accent)'} />
            Live ECG Waveform
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
                stroke={isPanic ? 'var(--alert)' : 'var(--accent)'} 
                strokeWidth={3}
                dot={false}
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
