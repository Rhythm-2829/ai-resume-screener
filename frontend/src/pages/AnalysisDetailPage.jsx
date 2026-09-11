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
} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ScoreBadge from '../components/ScoreBadge';

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '3.5rem' }}>
      <Navbar />
      <main style={styles.container}>
        {/* Navigation Breadcrumb */}
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
            <p>Loading evaluation details...</p>
          </div>
        ) : !analysis ? (
          <div style={styles.card}>
            <p style={{ color: '#ef4444' }}>Analysis report not found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h1 style={styles.title}>ATS Evaluation Report #{analysis.id}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  <Calendar size={14} color="#94a3b8" />
                  <span>
                    Generated on{' '}
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
            </div>

            {/* Score & Summary Banner */}
            <div style={styles.heroResultCard}>
              <div style={styles.scoreCol}>
                <ScoreBadge score={analysis.matchScore} size={140} />
              </div>
              <div style={styles.summaryCol}>
                <div style={styles.summaryBadge}>
                  <FileSearch size={14} color="#4f46e5" />
                  <span>Executive Assessment</span>
                </div>
                <h3 style={styles.summaryHeading}>Candidate Fit Summary</h3>
                <p style={styles.summaryText}>{analysis.summary}</p>
              </div>
            </div>

            {/* Strengths & Skill Gaps 2-Column Grid */}
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
                  {parseJson(analysis.strengths).map((s, i) => (
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
                  {parseJson(analysis.skillGaps).map((g, i) => (
                    <li key={i} style={styles.gapItem}>
                      <span style={styles.amberDot}></span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bullet Suggestions Studio */}
            <div style={styles.card}>
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
                {parseJson(analysis.suggestions).map((s, i) => (
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

            {/* Target Job Description Card */}
            <div style={styles.card}>
              <div style={styles.insightHeader}>
                <div style={{ ...styles.insightIcon, background: '#f1f5f9' }}>
                  <Briefcase size={18} color="#475569" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
                    Target Job Description
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Submitted benchmark requirements</p>
                </div>
              </div>
              <div style={styles.jdTextBlock}>
                {analysis.jobDescription}
              </div>
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
    margin: '1.5rem auto',
    padding: '0 1.5rem',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginBottom: '1.25rem',
    padding: 0,
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '1.75rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
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
  jdTextBlock: {
    fontSize: '0.92rem',
    color: '#475569',
    background: '#f8fafc',
    padding: '1rem 1.25rem',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
};
