import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Calendar,
  Award,
  Loader2,
  FolderPlus,
} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/api/analysis/history')
      .then((res) => setAnalyses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Compute metrics
  const totalCount = analyses.length;
  const avgScore =
    totalCount > 0
      ? Math.round(analyses.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalCount)
      : 0;
  const bestScore =
    totalCount > 0 ? Math.max(...analyses.map((a) => a.matchScore || 0)) : 0;

  // Filter analyses
  const filteredAnalyses = analyses.filter((a) =>
    (a.jobDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.summary || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreBadgeColor = (score) => {
    if (score >= 75) return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
    if (score >= 50) return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
    return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
      <Navbar />
      <main style={styles.container}>
        {/* Header Bar */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Candidate Dashboard</h1>
            <p style={styles.subtitle}>Track your resume ATS benchmarks and review past AI analyses.</p>
          </div>
          <button style={styles.primaryBtn} onClick={() => navigate('/analyze')}>
            <Plus size={18} />
            <span>New Analysis</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIconBox, background: '#eef2ff' }}>
              <FileCheck2 size={22} color="#4f46e5" />
            </div>
            <div>
              <p style={styles.metricLabel}>Total Analyses</p>
              <h3 style={styles.metricValue}>{totalCount}</h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIconBox, background: '#ecfdf5' }}>
              <TrendingUp size={22} color="#10b981" />
            </div>
            <div>
              <p style={styles.metricLabel}>Avg Match Score</p>
              <h3 style={{ ...styles.metricValue, color: '#059669' }}>
                {totalCount > 0 ? `${avgScore}%` : '—'}
              </h3>
            </div>
          </div>

          <div style={styles.metricCard}>
            <div style={{ ...styles.metricIconBox, background: '#fffbeb' }}>
              <Award size={22} color="#f59e0b" />
            </div>
            <div>
              <p style={styles.metricLabel}>Highest Match</p>
              <h3 style={{ ...styles.metricValue, color: '#d97706' }}>
                {totalCount > 0 ? `${bestScore}%` : '—'}
              </h3>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={styles.searchBarWrapper}>
          <div style={styles.searchBox}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by keywords or job description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
            <p>Loading your analysis history...</p>
          </div>
        ) : totalCount === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIconCircle}>
              <FolderPlus size={36} color="#4f46e5" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
              No evaluations yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
              Upload your resume and run your first AI ATS screen against any job description to view insights here.
            </p>
            <button style={styles.primaryBtn} onClick={() => navigate('/upload')}>
              <Plus size={18} />
              <span>Upload Resume to Start</span>
            </button>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>No analyses match your search query: "{searchTerm}".</p>
          </div>
        ) : (
          <div style={styles.historyList}>
            {filteredAnalyses.map((item) => {
              const badgeStyle = getScoreBadgeColor(item.matchScore);
              return (
                <div
                  key={item.id}
                  style={styles.historyCard}
                  onClick={() => navigate(`/analysis/${item.id}`)}
                >
                  <div style={styles.cardLeft}>
                    <div
                      style={{
                        ...styles.scoreBadge,
                        background: badgeStyle.bg,
                        borderColor: badgeStyle.border,
                        color: badgeStyle.text,
                      }}
                    >
                      <span style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                        {item.matchScore}%
                      </span>
                      <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: '700' }}>
                        Score
                      </span>
                    </div>
                  </div>

                  <div style={styles.cardCenter}>
                    <p style={styles.jdSnippet}>
                      {item.jobDescription
                        ? item.jobDescription.substring(0, 140) + '...'
                        : 'No description text'}
                    </p>
                    <div style={styles.cardMeta}>
                      <Calendar size={13} color="#94a3b8" />
                      <span>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recorded'}
                      </span>
                    </div>
                  </div>

                  <div style={styles.cardRight}>
                    <button style={styles.viewDetailBtn}>
                      <span>View Report</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
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
    marginTop: '0.2rem',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.75rem 1.35rem',
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  metricCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '1.25rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  metricIconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#0f172a',
    marginTop: '0.15rem',
  },
  searchBarWrapper: {
    marginBottom: '1.5rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    background: '#ffffff',
    padding: '0.75rem 1.15rem',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '0.95rem',
    color: '#0f172a',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  historyCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '1.25rem 1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
  },
  cardLeft: {
    flexShrink: 0,
  },
  scoreBadge: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCenter: {
    flex: 1,
    minWidth: 0,
  },
  jdSnippet: {
    fontSize: '0.95rem',
    color: '#334155',
    fontWeight: '500',
    lineHeight: '1.45',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginTop: '0.4rem',
  },
  cardRight: {
    flexShrink: 0,
  },
  viewDetailBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.45rem 0.85rem',
    background: '#f1f5f9',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '3.5rem 2rem',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
  emptyIconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#eef2ff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
};
