import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Calendar,
  Trash2,
  Sparkles,
} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setFetchingResumes(true);
    try {
      const res = await api.get('/api/resumes');
      setResumes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingResumes(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setMessage({ text: '', type: '' });
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setMessage({ text: 'Only PDF documents (.pdf) are supported.', type: 'error' });
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage({ text: 'File size exceeds maximum limit of 5MB.', type: 'error' });
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ text: 'Resume uploaded and parsed successfully!', type: 'success' });
      setFile(null);
      await fetchResumes();
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || 'Failed to upload resume. Please check file format.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'PDF';
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      <main style={styles.container}>
        {/* Page Header */}
        <div style={styles.header}>
          <div style={styles.headerTag}>
            <Sparkles size={14} color="#818cf8" />
            <span>Document Extraction</span>
          </div>
          <h1 style={styles.title}>Upload Resume</h1>
          <p style={styles.subtitle}>
            Upload your PDF resume to extract raw text, identify ATS formatting, and benchmark against roles.
          </p>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div
            style={{
              ...styles.messageBanner,
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              borderColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)',
              color: message.type === 'success' ? '#34d399' : '#fca5a5',
            }}
          >
            {message.type === 'success' ? (
              <CheckCircle2 size={18} color="#10b981" />
            ) : (
              <AlertCircle size={18} color="#f43f5e" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Upload Dropzone Card */}
        <div className="glass-panel" style={styles.card}>
          <form onSubmit={handleUpload}>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                ...styles.dropzone,
                borderColor: isDragging ? '#818cf8' : 'rgba(255, 255, 255, 0.15)',
                background: isDragging ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                boxShadow: isDragging ? '0 0 30px rgba(99, 102, 241, 0.3)' : 'none',
              }}
            >
              <input
                type="file"
                id="resumeFileInput"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                style={{ display: 'none' }}
              />

              <div style={styles.iconCircle}>
                <UploadCloud size={34} color="#818cf8" />
              </div>

              <label htmlFor="resumeFileInput" style={styles.dropzoneLabel}>
                <span style={{ color: '#818cf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>
                  Click to select file
                </span>{' '}
                or drag and drop your PDF here
              </label>

              <div style={styles.dropzoneFooter}>
                <span style={styles.badge}>PDF Only</span>
                <span style={styles.badge}>Max 5MB</span>
                <span style={styles.badge}>Apache PDFBox Extractor</span>
              </div>
            </div>

            {/* Selected File Card */}
            {file && (
              <div style={styles.selectedFileCard} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={styles.pdfIcon}>
                    <FileText size={20} color="#f43f5e" />
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>{file.name}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  style={styles.clearFileBtn}
                  title="Remove file"
                >
                  <Trash2 size={16} color="#94a3b8" />
                </button>
              </div>
            )}

            <button
              style={{
                ...styles.uploadBtn,
                opacity: !file || loading ? 0.6 : 1,
                cursor: !file || loading ? 'not-allowed' : 'pointer',
              }}
              type="submit"
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Extracting Text with PDFBox...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={18} />
                  <span>Upload & Process Document</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resumes Library */}
        <div style={{ marginTop: '3rem' }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Uploaded Documents</h2>
            <span style={styles.countBadge}>
              {resumes.length} {resumes.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {fetchingResumes ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <Loader2 size={26} color="#818cf8" className="animate-spin" style={{ margin: '0 auto 0.65rem' }} />
              <p>Loading document repository...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="glass-panel" style={styles.emptyCard}>
              <FileText size={40} color="#475569" style={{ marginBottom: '0.65rem' }} />
              <p style={{ fontWeight: '700', color: '#cbd5e1' }}>No resumes uploaded yet</p>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Upload a PDF resume above to start testing with ATS AI screening.
              </p>
            </div>
          ) : (
            <div style={styles.resumesGrid}>
              {resumes.map((r) => (
                <div key={r.id} className="glass-panel" style={styles.resumeCard}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={styles.cardPdfIcon}>
                      <FileText size={20} color="#818cf8" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={styles.resumeName} title={r.fileName}>
                        {r.fileName}
                      </h3>
                      <div style={styles.metaRow}>
                        <Calendar size={13} color="#64748b" />
                        <span>
                          {r.uploadedAt
                            ? new Date(r.uploadedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Uploaded'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    style={styles.analyzeActionBtn}
                    onClick={() => navigate('/analyze', { state: { resumeId: r.id } })}
                  >
                    <span>Analyze This Resume</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '0 1.5rem',
  },
  header: {
    marginBottom: '2rem',
  },
  headerTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#a5b4fc',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.65rem',
  },
  title: {
    fontSize: '2.1rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.98rem',
    color: '#94a3b8',
    marginTop: '0.35rem',
  },
  messageBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.85rem 1.25rem',
    borderRadius: '10px',
    border: '1px solid',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  card: {
    padding: '2rem',
  },
  dropzone: {
    border: '2px dashed rgba(255, 255, 255, 0.15)',
    borderRadius: '14px',
    padding: '3rem 1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  dropzoneLabel: {
    display: 'block',
    fontSize: '0.95rem',
    color: '#cbd5e1',
    marginBottom: '1rem',
  },
  dropzoneFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#a5b4fc',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0.25rem 0.65rem',
    borderRadius: '6px',
  },
  selectedFileCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.35rem',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginTop: '1.25rem',
  },
  pdfIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    background: 'rgba(244, 63, 94, 0.15)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFileBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.4rem',
  },
  uploadBtn: {
    marginTop: '1.5rem',
    width: '100%',
    padding: '0.95rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  sectionTitle: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  countBadge: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#a5b4fc',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
  },
  resumesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.25rem',
  },
  resumeCard: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1.25rem',
  },
  cardPdfIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resumeName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.8rem',
    color: '#64748b',
    marginTop: '0.25rem',
  },
  analyzeActionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    width: '100%',
    padding: '0.6rem',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#a5b4fc',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  emptyCard: {
    padding: '3.5rem 1.5rem',
    textAlign: 'center',
  },
};
