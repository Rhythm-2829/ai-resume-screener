import React, { useState, useEffect } from 'react';

export default function ScoreBadge({ score, size = 140 }) {
  const targetScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const [displayScore, setDisplayScore] = useState(0);

  // Dynamic Count-Up Animation from 0 to targetScore
  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const stepValue = targetScore / totalSteps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetScore]);

  // Color config
  const config = targetScore >= 75
    ? { color: '#10b981', gradientStart: '#34d399', gradientEnd: '#059669', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', label: 'Strong Match', glow: 'rgba(16, 185, 129, 0.3)' }
    : targetScore >= 50
    ? { color: '#f59e0b', gradientStart: '#fbbf24', gradientEnd: '#d97706', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.35)', label: 'Moderate Match', glow: 'rgba(245, 158, 11, 0.3)' }
    : { color: '#f43f5e', gradientStart: '#fb7185', gradientEnd: '#e11d48', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.35)', label: 'Low Match', glow: 'rgba(244, 63, 94, 0.3)' };

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 12px ${config.glow})` }}>
          <defs>
            <linearGradient id={`gaugeGradient-${targetScore}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.gradientStart} />
              <stop offset="100%" stopColor={config.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Foreground animated progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gaugeGradient-${targetScore})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
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
          <span style={{ fontSize: '2.1rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {displayScore}%
          </span>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', color: '#94a3b8', marginTop: '4px' }}>
            ATS Match
          </span>
        </div>
      </div>

      {/* Pill Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.95rem',
          borderRadius: '9999px',
          background: config.bg,
          border: `1px solid ${config.border}`,
          color: config.color,
          fontWeight: '700',
          fontSize: '0.85rem',
          boxShadow: `0 0 15px -3px ${config.glow}`,
        }}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: config.color, boxShadow: `0 0 8px ${config.color}` }}></span>
        <span>{config.label}</span>
      </div>
    </div>
  );
}
