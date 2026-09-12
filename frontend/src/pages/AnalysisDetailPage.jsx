import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Briefcase,
  FileSearch,
  Loader2,
  Layers,
  FileCheck,
  CheckSquare,
  XSquare,
} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ScoreBadge from '../components/ScoreBadge';

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'skills' | 'rewrites' | 'jd'
  const [copiedIndex, setCopiedIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/api/analysis/${id}`)
      .then((res) => setAnalysis(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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
        {/* Navigation Breadcrumb */}
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4.5rem', color: '#94a3b8' }}>
            <Loader2 size={32} color="#818cf8" className="animate-spin" style={{ margin: '0 auto 0.85rem' }} />
            <p>Loading evaluation details...</p>
          </div>
        ) : !analysis ? (
          <div className="glass-panel" style={styles.card}>
            <p style={{ color: '#f43f5e' }}>Analysis report not found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
            {/* Page Header */}
            <div>
              <h1 style={styles.title}>ATS Diagnostic Report #{analysis.id}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                <Calendar size={14} color="#64748b" />
                <span>
                  Evaluated on{' '}
                  {analysis.createdAt
                    ? new Date(analysis.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recently'}
                </span>
              </div>
            </div>

            {/* Top Hero Banner */}
            <div className="glass-panel" style={styles.heroResultCard}>
              <div style={styles.scoreCol}>
                <ScoreBadge score={analysis.matchScore} size={150} />
              </div>
              <div style={styles.summaryCol}>
                <div style={styles.summaryBadge}>
                  <FileSearch size={14} color="#a5b4fc" />
                  <span>Candidate Fit Overview</span>
                </div>
                <h3 style={styles.summaryHeading}>Diagnostic Assessment</h3>
                <p style={styles.summaryText}>{analysis.summary}</p>
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
                <span>Skills Matrix</span>
              </button>
              <button
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'rewrites' ? styles.activeTabBtn : {}),
                }}
                onClick={() => setActiveTab('rewrites')}
              >
                <Lightbulb size={16} />
                <span>Bullet Rewrites</span>
              </button>
              <button
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'jd' ? styles.activeTabBtn : {}),
                }}
                onClick={() => setActiveTab('jd')}
              >
                <Briefcase size={16} />
                <span>Job Description</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div style={styles.insightsGrid} className="animate-fade-in">
                {/* Strengths */}
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
                    {parseJson(analysis.strengths).map((s, i) => (
                      <li key={i} style={styles.strengthItem}>
                        <span style={styles.greenDot}></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skill Gaps */}
                <div className="glass-panel" style={styles.card}>
                  <div style={styles.insightHeader}>
                    <div style={{ ...styles.insightIcon, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      <AlertTriangle size={18} color="#f59e0b" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f59e0b' }}>Identified Skill Gaps</h3>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Missing or unmentioned requirements</p>
                    </div>
                  </div>
                  <ul style={styles.list}>
                    {parseJson(analysis.skillGaps).map((g, i) => (
                      <li key={i} style={styles.gapItem}>
                        <span style={styles.amberDot}></span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: SKILLS MATRIX */}
            {activeTab === 'skills' && (
              <div className="glass-panel animate-fade-in" style={styles.card}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.25rem' }}>
                  Target Role Qualification Matrix
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.95rem', marginBottom: '0.85rem' }}>
                      <CheckSquare size={16} />
                      <span>Matched Keywords & Skills</span>
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {parseJson(analysis.strengths).map((s, i) => (
                        <div key={i} style={styles.tagMatched}>
                          <span>✓ {s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.95rem', marginBottom: '0.85rem' }}>
                      <XSquare size={16} />
                      <span>Missing / Recommended Keywords</span>
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {parseJson(analysis.skillGaps).map((g, i) => (
                        <div key={i} style={styles.tagMissing}>
                          <span>+ {g}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BULLET REWRITES */}
            {activeTab === 'rewrites' && (
              <div className="glass-panel animate-fade-in" style={styles.card}>
                <div style={styles.insightHeader}>
                  <div style={{ ...styles.insightIcon, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <Lightbulb size={18} color="#818cf8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>
                      AI Resume Bullet Point Optimization
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Actionable, metric-driven rewrites tailored to target ATS systems.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                  {parseJson(analysis.suggestions).map((s, i) => (
                    <div key={i} style={styles.suggestionCard}>
                      <div style={styles.beforeBox}>
                        <span style={styles.subLabelBefore}>Current Bullet in Resume:</span>
                        <p style={styles.beforeText}>"{s.original}"</p>
                      </div>

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

            {/* TAB 4: JOB DESCRIPTION */}
            {activeTab === 'jd' && (
              <div className="glass-panel animate-fade-in" style={styles.card}>
                <div style={styles.insightHeader}>
                  <div style={{ ...styles.insightIcon, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Briefcase size={18} color="#cbd5e1" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                      Submitted Job Specification
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Target benchmark for this evaluation</p>
                  </div>
                </div>
                <div style={styles.jdTextBlock}>
                  {analysis.jobDescription}
                </div>
              </div>
            )}
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
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    color: '#818cf8',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    padding: 0,
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  card: {
    padding: '1.75rem',
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
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '0.5rem',
    flexWrap: 'wrap',
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
  },
  afterText: {
    fontSize: '0.93rem',
    fontWeight: '500',
    color: '#f0fdf4',
    marginTop: '0.4rem',
    lineHeight: '1.6',
  },
  jdTextBlock: {
    fontSize: '0.95rem',
    color: '#cbd5e1',
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
  },
};
