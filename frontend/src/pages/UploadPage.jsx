import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/resumes').then(res => setResumes(res.data)).catch(() => {});
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('✅ Resume uploaded successfully!');
      const res = await api.get('/api/resumes');
      setResumes(res.data);
      setFile(null);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Upload failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Upload Resume</h2>

        <div style={styles.card}>
          <form onSubmit={handleUpload}>
            <input
              type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files[0])}
              style={{ marginBottom: '1rem', display: 'block' }}
            />
            {file && <p style={{ color: '#4a5568', marginBottom: '1rem' }}>Selected: {file.name}</p>}
            <button style={styles.button} type="submit" disabled={loading || !file}>
              {loading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </form>
          {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
        </div>

        {resumes.length > 0 && (
          <div style={styles.card}>
            <h3 style={{ marginBottom: '1rem', color: '#1a202c' }}>Your Resumes</h3>
            {resumes.map(r => (
              <div key={r.id} style={styles.resumeItem}>
                <span>📄 {r.fileName}</span>
                <button
                  style={styles.analyzeBtn}
                  onClick={() => navigate('/analyze', { state: { resumeId: r.id } })}
                >
                  Analyze →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' },
  heading: { color: '#1a202c', marginBottom: '1.5rem' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  button: { padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  resumeItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' },
  analyzeBtn: { padding: '0.4rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};
