import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Award, Calendar, Zap, ArrowUpRight } from 'lucide-react';

export default function ScoreTrendChart({ analyses = [] }) {
  if (!analyses || analyses.length === 0) {
    return null;
  }

  // Sort chronologically (oldest to newest)
  const sorted = [...analyses].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );

  const chartData = sorted.map((item, idx) => {
    const d = item.createdAt ? new Date(item.createdAt) : new Date();
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      run: `Run #${idx + 1}`,
      score: item.matchScore || 0,
      date: formattedDate,
      fullDate: d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      snippet: (item.jobDescription || 'Technical Role').slice(0, 45) + '...',
    };
  });

  const firstScore = chartData[0]?.score || 0;
  const latestScore = chartData[chartData.length - 1]?.score || 0;
  const scoreDelta = latestScore - firstScore;
  const maxScore = Math.max(...chartData.map((d) => d.score));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={styles.tooltipBox}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase' }}>
              {data.run} • {data.date}
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: data.score >= 75 ? '#10b981' : data.score >= 50 ? '#f59e0b' : '#f43f5e',
              }}
            >
              {data.score}% ATS
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>
            "{data.snippet}"
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={styles.container}>
      {/* Header Bar */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>
            <TrendingUp size={13} color="#818cf8" />
            <span>ATS Trajectory Analytics</span>
          </div>
          <h2 style={styles.title}>Candidate Score Progression</h2>
          <p style={styles.subtitle}>
            Visual timeline of your resume compatibility across historical evaluations.
          </p>
        </div>

        {/* Delta Stat Pill */}
        <div style={styles.deltaBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowUpRight size={16} color={scoreDelta >= 0 ? '#10b981' : '#f43f5e'} />
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: scoreDelta >= 0 ? '#10b981' : '#f43f5e' }}>
              {scoreDelta >= 0 ? `+${scoreDelta}%` : `${scoreDelta}%`}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>
            Overall Trajectory
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height: '240px', marginTop: '1.25rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              ticks={[0, 25, 50, 75, 100]}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Target 75% Interview Shortlist Line */}
            <ReferenceLine
              y={75}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{
                value: '75% Target Shortlist',
                fill: '#34d399',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#818cf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreAreaGradient)"
              activeDot={{
                r: 6,
                fill: '#6366f1',
                stroke: '#ffffff',
                strokeWidth: 2,
                boxShadow: '0 0 10px #6366f1',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics Strip */}
      <div style={styles.footerStrip}>
        <div style={styles.statCol}>
          <span style={styles.statLabel}>First Assessment</span>
          <span style={styles.statVal}>{firstScore}%</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.statCol}>
          <span style={styles.statLabel}>Peak Recorded Score</span>
          <span style={{ ...styles.statVal, color: '#10b981' }}>{maxScore}%</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.statCol}>
          <span style={styles.statLabel}>Latest Assessment</span>
          <span style={styles.statVal}>{latestScore}%</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.statCol}>
          <span style={styles.statLabel}>Evaluations Tracked</span>
          <span style={styles.statVal}>{chartData.length}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.75rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#a5b4fc',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.88rem',
    color: '#94a3b8',
    marginTop: '0.2rem',
  },
  deltaBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '0.6rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  tooltipBox: {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    maxWidth: '240px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
  footerStrip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  statCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  statVal: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#ffffff',
    marginTop: '0.2rem',
  },
  divider: {
    width: '1px',
    height: '24px',
    background: 'rgba(255, 255, 255, 0.08)',
  },
};
