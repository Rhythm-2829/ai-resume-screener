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
  Layers,
  FileCheck,
  CheckSquare,
  XSquare,
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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'skills' | 'rewrites'
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
    'Parsing resume content & architecture...',
    'Checking Redis cache for identical hash...',
    'Matching technical qualifications against job description...',
    'Evaluating ATS compatibility and scoring algorithm...',
    'Synthesizing metric-driven bullet point rewrites...',
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
      }, 1600);
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
      setActiveTab('overview');
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
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      <main style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTag}>
            <Sparkles size={14} color="#818cf8" />
            <span>AI ATS Evaluation Engine</span>
          </div>
          <h1 style={styles.title}>Resume Screening Studio</h1>
          <p style={styles.subtitle}>
            Benchmark your technical qualifications against real job specifications with deterministic Redis caching and instant bullet rewrites.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel" style={styles.card}>
          {/* Daily Quota Progress Widget */}
          <div style={styles.quotaBox}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gauge size={16} color={quota.remaining === 0 ? '#f43f5e' : '#818cf8'} />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc' }}>
                  Daily Screening Quota
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: quota.remaining === 0 ? '#f43f5e' : '#a5b4fc',
                  background: quota.remaining === 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                  border: `1px solid ${quota.remaining === 0 ? 'rgba(244, 63, 94, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
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
                      ? 'linear-gradient(90deg, #f43f5e, #e11d48)'
                      : 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                  boxShadow: quota.remaining === 0 ? '0 0 10px rgba(244, 63, 94, 0.5)' : '0 0 10px rgba(99, 102, 241, 0.5)',
                }}
              />
            </div>
          </div>

          {quota.remaining === 0 && (
            <div style={styles.quotaExhaustedBanner}>
              <ShieldAlert size={18} color="#f43f5e" style={{ flexShrink: 0 }} />
              <span>You have reached your limit of {quota.limit} analyses for today. Your quota will automatically reset at midnight!</span>
            </div>
          )}

          <form onSubmit={handleAnalyze}>
            {/* Resume Selection */}
            <div style={{ marginBottom: '1.4rem' }}>
              <label style={styles.label}>
                <FileText size={16} color="#818cf8" />
                <span>Select Target Resume</span>
              </label>
              {resumes.length === 0 ? (
                <div style={styles.noResumesBanner}>
                  <span>No resumes uploaded yet.</span>
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
                      {r.fileName} (Uploaded {new Date(r.uploadedAt || Date.now()).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Job Description Input */}
            <div style={{ marginBottom: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ ...styles.label, margin: 0 }}>
                  <Briefcase size={16} color="#818cf8" />
                  <span>Job Description Requirements</span>
                </label>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: jobDescription.length > 900 ? '#f43f5e' : '#64748b',
                  }}
                >
                  {jobDescription.length} / 1000 characters
                </span>
              </div>

              {/* Sample Presets */}
              <div style={styles.presetsRow}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Quick Templates:</span>
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
                <AlertTriangle size={18} color="#f43f5e" style={{ flexShrink: 0 }} />
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
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Launch AI Screening Evaluation</span>
                </>
              )}
            </button>
          </form>

          {/* Stepped Pulse Loading Card */}
          {loading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinnerWrapper}>
                <Loader2 size={26} color="#818cf8" className="animate-spin" />
              </div>
              <div>
                <p style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>
                  {loadingSteps[loadingStep]}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Cached queries return in &lt;10ms via Redis; new queries take ~4–6s
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results Studio */}
        {result && (
          <div style={{ marginTop: '2.5rem' }} className="animate-fade-in">
            {/* Top Hero Banner */}
            <div className="glass-panel" style={styles.heroResultCard}>
              <div style={styles.scoreCol}>
                <ScoreBadge score={result.matchScore} size={150} />
              </div>
              <div style={styles.summaryCol}>
                <div style={styles.summaryBadge}>
                  <FileSearch size={14} color="#a5b4fc" />
                  <span>Recruiter ATS Diagnostic</span>
                </div>
                <h3 style={styles.summaryHeading}>Executive Candidate Assessment</h3>
                <p style={styles.summaryText}>{result.summary}</p>
              </div>
            </div>

            {/* Studio Navigation Tabs */}
            <div style={styles.tabNav}>
              <button
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'overview' ? styles.activeTabBtn : {}),
                }}
                onClick={() => setActiveTab('overview')}
              >
                <Layers size={16} />
                <span>Overview & Fit</span>
              </button>
              <button
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'skills' ? styles.activeTabBtn : {}),
                }}
                onClick={() => setActiveTab('skills')}
              >
                <FileCheck size={16} />
                <span>Skills & Keyword Matrix</span>
              </button>
              <button
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'rewrites' ? styles.activeTabBtn : {}),
                }}
                onClick={() => setActiveTab('rewrites')}
              >
                <Lightbulb size={16} />
                <span>Bullet Rewriter Studio</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div style={styles.insightsGrid} className="animate-fade-in">
                {/* Strengths Card */}
                <div className="glass-panel" style={styles.card}>
                  <div style={styles.insightHeader}>
                    <div style={{ ...styles.insightIcon, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#10b981' }}>Candidate Strengths</h3>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verified competencies & matched keywords</p>
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

                {/* Skill Gaps Card */}
                <div className="glass-panel" style={styles.card}>
                  <div style={styles.insightHeader}>
                    <div style={{ ...styles.insightIcon, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      <AlertTriangle size={18} color="#f59e0b" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f59e0b' }}>Identified Skill Gaps</h3>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Unfound requirements & missing technologies</p>
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
            )}

            {/* TAB 2: SKILLS & KEYWORD MATRIX */}
            {activeTab === 'skills' && (
              <div className="glass-panel animate-fade-in" style={{ ...styles.card, marginTop: '1.25rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.35rem' }}>
                    Keyword Alignment Matrix
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Visual comparison of candidate resume qualifications versus job specification requirements.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.95rem', marginBottom: '0.85rem' }}>
                      <CheckSquare size={16} />
                      <span>Matched Keywords & Skills ({parseJson(result.strengths).length})</span>
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {parseJson(result.strengths).map((s, i) => (
                        <div key={i} style={styles.tagMatched}>
                          <span>✓ {s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.95rem', marginBottom: '0.85rem' }}>
                      <XSquare size={16} />
                      <span>Missing / Recommended Keywords ({parseJson(result.skillGaps).length})</span>
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {parseJson(result.skillGaps).map((g, i) => (
                        <div key={i} style={styles.tagMissing}>
                          <span>+ {g}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BULLET REWRITER STUDIO */}
            {activeTab === 'rewrites' && (
              <div className="glass-panel animate-fade-in" style={{ ...styles.card, marginTop: '1.25rem' }}>
                <div style={styles.insightHeader}>
                  <div style={{ ...styles.insightIcon, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <Lightbulb size={18} color="#818cf8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
                      AI Resume Bullet Point Optimization
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Quantifiable, action-verb driven rewrites tailored to pass ATS screeners.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                  {parseJson(result.suggestions).map((s, i) => (
                    <div key={i} style={styles.suggestionCard}>
                      {/* Before */}
                      <div style={styles.beforeBox}>
                        <span style={styles.subLabelBefore}>Current Resume Bullet:</span>
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
                            title="Copy rewrite to clipboard"
                          >
                            {copiedIndex === i ? (
                              <>
                                <Check size={14} color="#10b981" />
                                <span style={{ color: '#10b981' }}>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} color="#a5b4fc" />
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
            )}

            {/* Bottom Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
              <button
                style={styles.viewHistoryBtn}
                onClick={() => navigate('/dashboard')}
              >
                <span>View All Historical Evaluations</span>
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
    maxWidth: '1000px',
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
    fontSize: '0.78rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.75rem',
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
    maxWidth: '720px',
    lineHeight: '1.6',
  },
  card: {
    padding: '1.75rem',
  },
  quotaBox: {
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '12px',
    padding: '0.9rem 1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    marginBottom: '1.5rem',
  },
  progressBarTrack: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.4s ease, background 0.3s ease',
  },
  quotaExhaustedBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.85rem 1rem',
    background: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    borderRadius: '10px',
    color: '#fca5a5',
    fontSize: '0.9rem',
    marginBottom: '1.25rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: '0.5rem',
  },
  select: {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#ffffff',
    background: '#0f172a',
    outline: 'none',
  },
  noResumesBanner: {
    padding: '0.95rem 1.15rem',
    background: 'rgba(245, 158, 11, 0.1)',
    borderRadius: '10px',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    color: '#fbbf24',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadRedirectBtn: {
    background: 'none',
    border: 'none',
    color: '#a5b4fc',
    fontWeight: '700',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  presetsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
  },
  presetChip: {
    padding: '0.3rem 0.75rem',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  textarea: {
    width: '100%',
    height: '140px',
    padding: '0.95rem',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#ffffff',
    background: '#0f172a',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.6',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.85rem 1rem',
    background: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    borderRadius: '10px',
    color: '#fca5a5',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  analyzeBtn: {
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
    transition: 'all 0.2s ease',
  },
  loadingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    marginTop: '1.5rem',
    padding: '1.15rem 1.5rem',
    background: 'rgba(15, 23, 42, 0.8)',
    borderRadius: '12px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.15)',
  },
  spinnerWrapper: {
    flexShrink: 0,
  },
  heroResultCard: {
    padding: '2.25rem',
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
    padding: '0.2rem 0.6rem',
    background: 'rgba(99, 102, 241, 0.18)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#a5b4fc',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.65rem',
  },
  summaryHeading: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  summaryText: {
    fontSize: '0.95rem',
    color: '#cbd5e1',
    lineHeight: '1.65',
  },
  tabNav: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '0.5rem',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: 'none',
    border: 'none',
    padding: '0.65rem 1.15rem',
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.18s ease',
  },
  activeTabBtn: {
    color: '#ffffff',
    background: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.25rem',
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    marginBottom: '1rem',
  },
  insightIcon: {
    width: '38px',
    height: '38px',
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
    gap: '0.85rem',
  },
  strengthItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.65rem',
    fontSize: '0.92rem',
    color: '#e2e8f0',
    lineHeight: '1.5',
  },
  greenDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#10b981',
    marginTop: '6px',
    flexShrink: 0,
    boxShadow: '0 0 8px #10b981',
  },
  gapItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.65rem',
    fontSize: '0.92rem',
    color: '#e2e8f0',
    lineHeight: '1.5',
  },
  amberDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#f59e0b',
    marginTop: '6px',
    flexShrink: 0,
    boxShadow: '0 0 8px #f59e0b',
  },
  tagMatched: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.35)',
    color: '#34d399',
    padding: '0.35rem 0.8rem',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: '600',
  },
  tagMissing: {
    background: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    color: '#fbbf24',
    padding: '0.35rem 0.8rem',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: '600',
  },
  suggestionCard: {
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.95rem',
  },
  beforeBox: {
    borderLeft: '3px solid #475569',
    paddingLeft: '0.95rem',
  },
  subLabelBefore: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  beforeText: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: '0.25rem',
    lineHeight: '1.5',
  },
  afterBox: {
    borderLeft: '3px solid #10b981',
    paddingLeft: '0.95rem',
    background: 'rgba(16, 185, 129, 0.08)',
    borderRadius: '0 10px 10px 0',
    padding: '0.95rem',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  subLabelAfter: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#34d399',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    padding: '0.25rem 0.65rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#a5b4fc',
    transition: 'all 0.15s ease',
  },
  afterText: {
    fontSize: '0.93rem',
    fontWeight: '500',
    color: '#f0fdf4',
    marginTop: '0.4rem',
    lineHeight: '1.6',
  },
  viewHistoryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 2rem',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
};
