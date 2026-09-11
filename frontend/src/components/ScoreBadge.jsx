import React from 'react';

export default function ScoreBadge({ score, size = 130 }) {
  const cleanScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  
  // Dynamic color palette based on score
  const config = cleanScore >= 75
    ? { color: '#10b981', gradientStart: '#34d399', gradientEnd: '#059669', bg: '#ecfdf5', label: 'Strong Match', textColor: '#065f46', desc: 'ATS Optimized' }
    : cleanScore >= 50
    ? { color: '#f59e0b', gradientStart: '#fbbf24', gradientEnd: '#d97706', bg: '#fffbeb', label: 'Moderate Match', textColor: '#92400e', desc: 'Good Alignment' }
    : { color: '#ef4444', gradientStart: '#f87171', gradientEnd: '#dc2626', bg: '#fef2f2', label: 'Low Match', textColor: '#991b1b', desc: 'Needs Optimization' };

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cleanScore / 100) * circumference;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={`gaugeGradient-${cleanScore}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.gradientStart} />
              <stop offset="100%" stopColor={config.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Foreground score progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gaugeGradient-${cleanScore})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '1.85rem', fontWeight: '800', color: config.color, lineHeight: 1 }}>
            {cleanScore}%
          </span>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', color: '#64748b', marginTop: '3px' }}>
            ATS Match
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.3rem 0.85rem',
          borderRadius: '9999px',
          background: config.bg,
          border: `1px solid ${config.color}30`,
          color: config.textColor,
          fontWeight: '600',
          fontSize: '0.85rem',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: config.color }}></span>
        <span>{config.label}</span>
      </div>
    </div>
  );
}
