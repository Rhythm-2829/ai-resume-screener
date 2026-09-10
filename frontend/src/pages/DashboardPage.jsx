import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ScoreBadge from '../components/ScoreBadge';

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/analysis/history')
      .then(res => setAnalyses(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Analysis History</h2>
          <button style={styles.button} onClick={() => navigate('/analyze')}>
            + New Analysis
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && analyses.length === 0 && (
          <div style={styles.empty}>
            <p>No analyses yet.</p>
            <button style={styles.button} onClick={() => navigate('/upload')}>
              Upload Resume to Start →
            </button>
          </div>
        )}

        {analyses.map(a => (
          <div key={a.id} style={styles.card} onClick={() => navigate(`/analysis/${a.id}`)}>
            <div style={styles.cardLeft}>
              <ScoreBadge score={a.matchScore} />
            </div>
            <div style={styles.cardRight}>
              <p style={styles.jd}>{a.jobDescription.substring(0, 100)}...</p>
              <p style={styles.date}>
                {new Date(a.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
            </div>
            <span style={styles.arrow}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { color: '#1a202c', margin: 0 },
  button: { padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  empty: { textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  card: { display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '1rem', cursor: 'pointer', transition: 'box-shadow 0.2s' },
  cardLeft: { flexShrink: 0 },
  cardRight: { flex: 1 },
  jd: { color: '#4a5568', marginBottom: '0.25rem', lineHeight: '1.4' },
  date: { color: '#a0aec0', fontSize: '0.85rem' },
  arrow: { color: '#a0aec0', fontSize: '1.2rem' },
};
