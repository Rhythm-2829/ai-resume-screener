import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  RefreshCw,
  Lightbulb,
  FileSearch,
  Gauge,
  ShieldAlert,
} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ScoreBadge from '../components/ScoreBadge';

export default function AnalyzePage() {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [quota, setQuota] = useState({ used: 0, limit: 5, remaining: 5 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const sampleJDs = [
    {
      title: 'Java Backend Dev',
      text: 'We are looking for a Java Backend Developer with 1-3 years of experience. You will build REST APIs and microservices using Java and Spring Boot. Responsibilities include database design with PostgreSQL and JPA/Hibernate, implementing JWT-based authentication using Spring Security, containerizing services with Docker, and collaborating with React frontends. Git version control and solid understanding of clean code required.',
    },
    {
      title: 'Full Stack Engineer',
      text: 'Seeking a Full Stack Engineer proficient in Java, Spring Boot, and React.js. You will architect end-to-end features, implement secure JWT session flows, manage PostgreSQL schemas, and write automated tests. Familiarity with cloud deployment, Docker containers, and responsive UI design is required. Strong communication and problem solving skills expected.',
    },
  ];

  const loadingSteps = [
    'Parsing resume text and context...',
    'Matching technical qualifications against job description...',
    'Evaluating ATS compatibility and scoring algorithm...',
    'Generating impact-driven bullet point rewrites...',
  ];

  const fetchQuota = () => {
    api.get('/api/analysis/quota')
      .then((res) => setQuota(res.data))
      .catch((err) => console.error('Failed to load quota', err));
  };

  useEffect(() => {
    api.get('/api/resumes').then((res) => {
      setResumes(res.data);
      if (location.state?.resumeId) {
        setResumeId(location.state.resumeId);
      } else if (res.data.length > 0) {
        setResumeId(res.data[0].id);
      }
    });
    fetchQuota();
  }, [location.state]);

  // Loading animation step rotator
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (quota.remaining <= 0) {
      setError('Daily quota reached (5/5). Your limit resets at midnight!');
      return;
    }
    if (!resumeId) {
      setError('Please select a resume to analyze.');
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError('Job description must be at least 50 characters long.');
      return;
    }
    if (jobDescription.length > 1000) {
      setError('Job description exceeds maximum 1,000 characters.');
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await api.post('/api/analysis/run', {
        resumeId: Number(resumeId),
        jobDescription: jobDescription.trim(),
      });
      setResult(res.data);
      fetchQuota();
    } catch (err) {
      setError(err.response?.data?.error || 'AI analysis encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const parseJson = (str) => {
    if (!str) return [];
    try {
      return typeof str === 'string' ? JSON.parse(str) : str;
    } catch {
      return [];
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
      <Navbar />
      <main style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>AI Resume Screening</h1>
          <p style={styles.subtitle}>
            Benchmark your resume against any job description to evaluate ATS match and get instant rewrites.
          </p>
        </div>

        {/* Input Form Card */}
        <div style={styles.card}>
          {/* Daily Quota Progress Widget */}
          <div style={styles.quotaBox}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Gauge size={16} color={quota.remaining === 0 ? '#ef4444' : '#4f46e5'} />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                  Daily Screening Quota
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: quota.remaining === 0 ? '#ef4444' : '#4f46e5',
                  background: quota.remaining === 0 ? '#fef2f2' : '#eef2ff',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '6px',
                }}
              >
                {quota.remaining} of {quota.limit} remaining today
              </span>
            </div>

            {/* Progress Bar Track */}
            <div style={styles.progressBarTrack}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${Math.min(100, (quota.used / quota.limit) * 100)}%`,
                  background:
                    quota.remaining === 0
                      ? '#ef4444'
                      : 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
                }}
              />
            </div>
          </div>

          {quota.remaining === 0 && (
            <div style={{ ...styles.errorBanner, background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', marginBottom: '1.25rem' }}>
              <ShieldAlert size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <span>You have reached your limit of {quota.limit} analyses for today. Your quota resets at midnight!</span>
            </div>
          )}

          <form onSubmit={handleAnalyze}>
            {/* Resume Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={styles.label}>
                <FileText size={16} color="#4f46e5" />
                <span>Select Target Resume</span>
              </label>
              {resumes.length === 0 ? (
                <div style={styles.noResumesBanner}>
                  <span>No resumes found.</span>
                  <button
                    type="button"
                    onClick={() => navigate('/upload')}
                    style={styles.uploadRedirectBtn}
                  >
                    Upload a PDF resume first →
                  </button>
                </div>
              ) : (
                <select
                  style={styles.select}
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  required
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fileName} (Uploaded on {new Date(r.uploadedAt || Date.now()).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Job Description Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label style={{ ...styles.label, margin: 0 }}>
                  <Briefcase size={16} color="#4f46e5" />
                  <span>Job Description</span>
                </label>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: jobDescription.length > 900 ? '#ef4444' : '#94a3b8',
                  }}
                >
                  {jobDescription.length} / 1000 characters
                </span>
              </div>

              {/* Sample Presets */}
              <div style={styles.presetsRow}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Quick Presets:</span>
                {sampleJDs.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setJobDescription(sample.text)}
                    style={styles.presetChip}
                  >
                    + {sample.title}
                  </button>
                ))}
              </div>

              <textarea
                style={styles.textarea}
                placeholder="Paste the target job description requirements here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={1000}
                required
              />
            </div>

            {/* Error Banner */}
            {error && (
              <div style={styles.errorBanner}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              style={{
                ...styles.analyzeBtn,
                opacity: loading || resumes.length === 0 || quota.remaining === 0 ? 0.6 : 1,
                cursor: loading || resumes.length === 0 || quota.remaining === 0 ? 'not-allowed' : 'pointer',
              }}
              type="submit"
              disabled={loading || resumes.length === 0 || quota.remaining === 0}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Run ATS AI Analysis</span>
                </>
              )}
            </button>
          </form>

          {/* Stepped Loading Card */}
          {loading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinnerWrapper}>
                <Loader2 size={28} color="#4f46e5" className="animate-spin" />
              </div>
              <div>
                <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>
                  {loadingSteps[loadingStep]}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Typically takes 4–8 seconds powered by Groq LLM
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results Presentation */}
        {result && (
          <div style={{ marginTop: '2rem' }}>
            {/* Score & Summary Banner */}
            <div style={styles.heroResultCard}>
              <div style={styles.scoreCol}>
                <ScoreBadge score={result.matchScore} size={140} />
              </div>
              <div style={styles.summaryCol}>
                <div style={styles.summaryBadge}>
                  <FileSearch size={14} color="#4f46e5" />
                  <span>Executive Assessment</span>
                </div>
                <h3 style={styles.summaryHeading}>Analysis Overview</h3>
                <p style={styles.summaryText}>{result.summary}</p>
              </div>
            </div>

            {/* Strengths & Gaps Grid */}
            <div style={styles.insightsGrid}>
              {/* Strengths */}
              <div style={styles.card}>
                <div style={styles.insightHeader}>
                  <div style={{ ...styles.insightIcon, background: '#ecfdf5' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#065f46' }}>Key Strengths</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Matched competencies & keywords</p>
                  </div>
                </div>
                <ul style={styles.list}>
                  {parseJson(result.strengths).map((s, i) => (
                    <li key={i} style={styles.strengthItem}>
                      <span style={styles.greenDot}></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skill Gaps */}
              <div style={styles.card}>
                <div style={styles.insightHeader}>
                  <div style={{ ...styles.insightIcon, background: '#fffbeb' }}>
                    <AlertTriangle size={18} color="#f59e0b" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#92400e' }}>Identified Skill Gaps</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Missing or unmentioned requirements</p>
                  </div>
                </div>
                <ul style={styles.list}>
                  {parseJson(result.skillGaps).map((g, i) => (
                    <li key={i} style={styles.gapItem}>
                      <span style={styles.amberDot}></span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bullet Suggestions Studio */}
            <div style={{ ...styles.card, marginTop: '1.5rem' }}>
              <div style={styles.insightHeader}>
                <div style={{ ...styles.insightIcon, background: '#eef2ff' }}>
                  <Lightbulb size={18} color="#4f46e5" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1e1b4b' }}>
                    AI Bullet Point Optimization
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Actionable, metric-driven rewrites tailored to target ATS systems.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                {parseJson(result.suggestions).map((s, i) => (
                  <div key={i} style={styles.suggestionCard}>
                    {/* Before */}
                    <div style={styles.beforeBox}>
                      <span style={styles.subLabelBefore}>Current Bullet in Resume:</span>
                      <p style={styles.beforeText}>"{s.original}"</p>
                    </div>

                    {/* After */}
                    <div style={styles.afterBox}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={styles.subLabelAfter}>✨ AI Improved Rewrite:</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(s.improved, i)}
                          style={styles.copyBtn}
                          title="Copy to clipboard"
                        >
                          {copiedIndex === i ? (
                            <>
                              <Check size={14} color="#059669" />
                              <span style={{ color: '#059669' }}>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} color="#4f46e5" />
                              <span>Copy Rewrite</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p style={styles.afterText}>"{s.improved}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button
                style={styles.viewHistoryBtn}
                onClick={() => navigate('/dashboard')}
              >
                <span>View Full Dashboard History</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '960px',
    margin: '2rem auto',
    padding: '0 1.5rem',
  },
  header: {
    marginBottom: '1.75rem',
  },
  title: {
    fontSize: '1.85rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginTop: '0.25rem',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '1.75rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
  },
  quotaBox: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '0.85rem 1.15rem',
    border: '1px solid #e2e8f0',
    marginBottom: '1.25rem',
  },
  progressBarTrack: {
    width: '100%',
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.4s ease, background 0.3s ease',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '0.45rem',
  },
  select: {
    width: '100%',
    padding: '0.75rem 0.9rem',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#0f172a',
    background: '#ffffff',
    outline: 'none',
  },
  noResumesBanner: {
    padding: '0.85rem 1rem',
    background: '#fffbeb',
    borderRadius: '8px',
    border: '1px solid #fef3c7',
    color: '#92400e',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadRedirectBtn: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontWeight: '700',
    cursor: 'pointer',
  },
  presetsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.65rem',
    flexWrap: 'wrap',
  },
  presetChip: {
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    color: '#475569',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  textarea: {
    width: '100%',
    height: '140px',
    padding: '0.85rem',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#0f172a',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.5',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.85rem 1rem',
    background: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '10px',
    color: '#991b1b',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  analyzeBtn: {
    width: '100%',
    padding: '0.9rem',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
  },
  loadingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.25rem',
    padding: '1rem 1.25rem',
    background: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  spinnerWrapper: {
    flexShrink: 0,
  },
  heroResultCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '2.5rem',
    flexWrap: 'wrap',
  },
  scoreCol: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  summaryCol: {
    flex: 1,
    minWidth: '280px',
  },
  summaryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.55rem',
    background: '#eef2ff',
    color: '#4f46e5',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  summaryHeading: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '0.45rem',
  },
  summaryText: {
    fontSize: '0.95rem',
    color: '#475569',
    lineHeight: '1.6',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  insightIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  strengthItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.65rem',
    fontSize: '0.9rem',
    color: '#334155',
    lineHeight: '1.5',
  },
  greenDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    marginTop: '6px',
    flexShrink: 0,
  },
  gapItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.65rem',
    fontSize: '0.9rem',
    color: '#334155',
    lineHeight: '1.5',
  },
  amberDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#f59e0b',
    marginTop: '6px',
    flexShrink: 0,
  },
  suggestionCard: {
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  beforeBox: {
    borderLeft: '3px solid #cbd5e1',
    paddingLeft: '0.85rem',
  },
  subLabelBefore: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  beforeText: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: '0.2rem',
    lineHeight: '1.5',
  },
  afterBox: {
    borderLeft: '3px solid #10b981',
    paddingLeft: '0.85rem',
    background: '#ffffff',
    borderRadius: '0 8px 8px 0',
    padding: '0.85rem',
    border: '1px solid #e2e8f0',
  },
  subLabelAfter: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#047857',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: '#f1f5f9',
    border: 'none',
    padding: '0.25rem 0.6rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#4f46e5',
  },
  afterText: {
    fontSize: '0.92rem',
    fontWeight: '500',
    color: '#064e3b',
    marginTop: '0.35rem',
    lineHeight: '1.5',
  },
  viewHistoryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.75rem',
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    color: '#4f46e5',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
  },
};
