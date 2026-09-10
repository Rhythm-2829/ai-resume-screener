import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ScoreBadge from '../components/ScoreBadge';

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/analysis/${id}`).then(res => setAnalysis(res.data));
  }, [id]);

  const parseJson = (str) => { try { return JSON.parse(str); } catch { return []; } };

  if (!analysis) return <div><Navbar /><p style={{ padding: '2rem' }}>Loading...</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={styles.container}>
        <button style={styles.back} onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>

        <div style={{ ...styles.card, textAlign: 'center' }}>
          <ScoreBadge score={analysis.matchScore} />
          <p style={{ marginTop: '1rem', color: '#4a5568' }}>{analysis.summary}</p>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={{ color: '#22c55e', marginBottom: '1rem' }}>✅ Strengths</h3>
            <ul style={styles.list}>
              {parseJson(analysis.strengths).map((s, i) => <li key={i} style={styles.listItem}>{s}</li>)}
            </ul>
          </div>
          <div style={styles.card}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Skill Gaps</h3>
            <ul style={styles.list}>
              {parseJson(analysis.skillGaps).map((s, i) => <li key={i} style={styles.listItem}>{s}</li>)}
            </ul>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ color: '#4f46e5', marginBottom: '1rem' }}>💡 Suggestions</h3>
          {parseJson(analysis.suggestions).map((s, i) => (
            <div key={i} style={styles.suggestion}>
              <div style={styles.original}><strong>Before:</strong> {s.original}</div>
              <div style={styles.improved}><strong>After:</strong> {s.improved}</div>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>📋 Job Description</h3>
          <p style={{ color: '#718096', lineHeight: '1.6' }}>{analysis.jobDescription}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  back: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem', padding: 0 },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  list: { paddingLeft: '1.25rem' },
  listItem: { marginBottom: '0.5rem', color: '#4a5568', lineHeight: '1.5' },
  suggestion: { borderLeft: '3px solid #4f46e5', paddingLeft: '1rem', marginBottom: '1rem' },
  original: { color: '#718096', marginBottom: '0.5rem', fontSize: '0.9rem' },
  improved: { color: '#22543d', fontSize: '0.9rem' },
};
