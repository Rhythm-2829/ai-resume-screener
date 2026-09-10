import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ScoreBadge from '../components/ScoreBadge';

export default function AnalyzePage() {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/resumes').then(res => {
      setResumes(res.data);
      if (location.state?.resumeId) setResumeId(location.state.resumeId);
    });
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await api.post('/api/analysis/run', {
        resumeId: Number(resumeId),
        jobDescription,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const parseJson = (str) => { try { return JSON.parse(str); } catch { return []; } };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Analyze Resume</h2>

        <div style={styles.card}>
          <form onSubmit={handleAnalyze}>
            <label style={styles.label}>Select Resume</label>
            <select style={styles.input} value={resumeId} onChange={e => setResumeId(e.target.value)} required>
              <option value="">-- Choose a resume --</option>
              {resumes.map(r => <option key={r.id} value={r.id}>{r.fileName}</option>)}
            </select>

            <label style={styles.label}>Job Description</label>
            <textarea
              style={{ ...styles.input, height: '150px', resize: 'vertical' }}
              placeholder="Paste the job description here (min 100 characters)..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              required
            />

            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? '🤖 AI is analyzing... (5-10 sec)' : '🚀 Analyze with AI'}
            </button>
          </form>
          {error && <div style={styles.error}>{error}</div>}
        </div>

        {result && (
          <div>
            {/* Score */}
            <div style={{ ...styles.card, textAlign: 'center' }}>
              <ScoreBadge score={result.matchScore} />
              <p style={{ marginTop: '1rem', color: '#4a5568' }}>{result.summary}</p>
            </div>

            <div style={styles.grid}>
              {/* Strengths */}
              <div style={styles.card}>
                <h3 style={{ color: '#22c55e', marginBottom: '1rem' }}>✅ Strengths</h3>
                <ul style={styles.list}>
                  {parseJson(result.strengths).map((s, i) => <li key={i} style={styles.listItem}>{s}</li>)}
                </ul>
              </div>

              {/* Skill Gaps */}
              <div style={styles.card}>
                <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Skill Gaps</h3>
                <ul style={styles.list}>
                  {parseJson(result.skillGaps).map((s, i) => <li key={i} style={styles.listItem}>{s}</li>)}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            <div style={styles.card}>
              <h3 style={{ color: '#4f46e5', marginBottom: '1rem' }}>💡 Suggestions</h3>
              {parseJson(result.suggestions).map((s, i) => (
                <div key={i} style={styles.suggestion}>
                  <div style={styles.original}><strong>Before:</strong> {s.original}</div>
                  <div style={styles.improved}><strong>After:</strong> {s.improved}</div>
                </div>
              ))}
            </div>

            <button style={{ ...styles.button, marginBottom: '2rem' }} onClick={() => navigate('/dashboard')}>
              View History →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  heading: { color: '#1a202c', marginBottom: '1.5rem' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' },
  button: { padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  error: { background: '#fed7d7', color: '#c53030', padding: '0.75rem', borderRadius: '8px', marginTop: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  list: { paddingLeft: '1.25rem' },
  listItem: { marginBottom: '0.5rem', color: '#4a5568', lineHeight: '1.5' },
  suggestion: { borderLeft: '3px solid #4f46e5', paddingLeft: '1rem', marginBottom: '1rem' },
  original: { color: '#718096', marginBottom: '0.5rem', fontSize: '0.9rem' },
  improved: { color: '#22543d', fontSize: '0.9rem' },
};
