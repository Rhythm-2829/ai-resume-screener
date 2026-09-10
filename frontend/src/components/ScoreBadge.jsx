export default function ScoreBadge({ score }) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const bg = score >= 70 ? '#dcfce7' : score >= 40 ? '#fef3c7' : '#fee2e2';
  const label = score >= 70 ? 'Strong Match' : score >= 40 ? 'Partial Match' : 'Weak Match';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: bg, border: `2px solid ${color}`, borderRadius: '12px', padding: '1rem 2rem' }}>
      <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color }}>{score}%</span>
      <span style={{ color, fontWeight: '600', fontSize: '0.9rem' }}>{label}</span>
    </div>
  );
}
