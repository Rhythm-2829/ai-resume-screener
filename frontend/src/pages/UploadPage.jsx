import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Calendar, HardDrive, Trash2 } from 'lucide-react';
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
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <main style={styles.container}>
        {/* Page Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Upload Resume</h1>
          <p style={styles.subtitle}>Upload your PDF resume to extract text and run AI-powered ATS screening.</p>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div
            style={{
              ...styles.messageBanner,
              background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
              borderColor: message.type === 'success' ? '#a7f3d0' : '#fecaca',
              color: message.type === 'success' ? '#065f46' : '#991b1b',
            }}
          >
            {message.type === 'success' ? (
              <CheckCircle2 size={18} color="#10b981" />
            ) : (
              <AlertCircle size={18} color="#ef4444" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Upload Dropzone Card */}
        <div style={styles.card}>
          <form onSubmit={handleUpload}>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                ...styles.dropzone,
                borderColor: isDragging ? '#4f46e5' : '#cbd5e1',
                background: isDragging ? '#eef2ff' : '#fafafa',
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
                <UploadCloud size={32} color="#4f46e5" />
              </div>

              <label htmlFor="resumeFileInput" style={styles.dropzoneLabel}>
                <span style={{ color: '#4f46e5', fontWeight: '700', cursor: 'pointer' }}>
                  Click to browse
                </span>{' '}
                or drag and drop your PDF here
              </label>

              <div style={styles.dropzoneFooter}>
                <span style={styles.badge}>PDF Only</span>
                <span style={styles.badge}>Max 5MB</span>
              </div>
            </div>

            {/* Selected File Card */}
            {file && (
              <div style={styles.selectedFileCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={styles.pdfIcon}>
                    <FileText size={20} color="#ef4444" />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.95rem' }}>{file.name}</p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{formatFileSize(file.size)}</p>
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
                  <span>Extracting & Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={18} />
                  <span>Upload & Process Resume</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resumes Library */}
        <div style={{ marginTop: '2.5rem' }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Uploaded Resumes</h2>
            <span style={styles.countBadge}>{resumes.length} {resumes.length === 1 ? 'file' : 'files'}</span>
          </div>

          {fetchingResumes ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
              <p>Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div style={styles.emptyCard}>
              <FileText size={36} color="#cbd5e1" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: '600', color: '#475569' }}>No resumes uploaded yet</p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Upload a PDF resume above to get started with AI analysis.</p>
            </div>
          ) : (
            <div style={styles.resumesGrid}>
              {resumes.map((r) => (
                <div key={r.id} style={styles.resumeCard}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={styles.cardPdfIcon}>
                      <FileText size={20} color="#4f46e5" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={styles.resumeName} title={r.fileName}>
                        {r.fileName}
                      </h3>
                      <div style={styles.metaRow}>
                        <Calendar size={13} color="#94a3b8" />
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
                    <span>Analyze</span>
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
    maxWidth: '850px',
    margin: '2rem auto',
    padding: '0 1.5rem',
  },
  header: {
    marginBottom: '1.75rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginTop: '0.25rem',
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
    fontWeight: '500',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '1.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
  },
  dropzone: {
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    padding: '2.5rem 1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  iconCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#eef2ff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  dropzoneLabel: {
    display: 'block',
    fontSize: '0.95rem',
    color: '#475569',
    marginBottom: '0.75rem',
  },
  dropzoneFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    background: '#f1f5f9',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
  },
  selectedFileCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.9rem 1.25rem',
    background: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    marginTop: '1.25rem',
  },
  pdfIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: '#fee2e2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFileBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.4rem',
    borderRadius: '6px',
  },
  uploadBtn: {
    marginTop: '1.25rem',
    width: '100%',
    padding: '0.85rem',
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  countBadge: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#64748b',
    background: '#e2e8f0',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
  },
  resumesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
  },
  resumeCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.15rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  cardPdfIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resumeName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#0f172a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginTop: '0.2rem',
  },
  analyzeActionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    width: '100%',
    padding: '0.5rem',
    background: '#f1f5f9',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  emptyCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '3rem 1.5rem',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
};
