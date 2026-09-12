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
  Zap,
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

  const getScoreBadgeConfig = (score) => {
    if (score >= 75) return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.4)', glow: 'rgba(16, 185, 129, 0.3)' };
    if (score >= 50) return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)', glow: 'rgba(245, 158, 11, 0.3)' };
    return { bg: 'rgba(244, 63, 94, 0.15)', text: '#f43f5e', border: 'rgba(244, 63, 94, 0.4)', glow: 'rgba(244, 63, 94, 0.3)' };
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar />
      <main style={styles.container}>
        {/* Welcome Hero Bar */}
        <div style={styles.heroSection}>
          <div>
            <div style={styles.badgePill}>
              <Zap size={14} color="#818cf8" />
              <span>Real-time Candidate Analytics</span>
            </div>
            <h1 style={styles.title}>Candidate Dashboard</h1>
            <p style={styles.subtitle}>
              Monitor ATS score progression, evaluate JD compatibility, and review past Groq AI insights.
            </p>
          </div>
          <button style={styles.primaryBtn} onClick={() => navigate('/analyze')}>
            <Plus size={18} />
            <span>New AI Screen</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div style={styles.metricsGrid}>
          <div className="glass-panel" style={styles.metricCard}>
            <div style={{ ...styles.metricIconBox, background: 'rgba(99, 102, 241, 0.18)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <FileCheck2 size={24} color="#818cf8" />
            </div>
            <div>
              <p style={styles.metricLabel}>Total Evaluations</p>
              <h3 style={styles.metricValue}>{totalCount}</h3>
            </div>
          </div>

          <div className="glass-panel" style={styles.metricCard}>
            <div style={{ ...styles.metricIconBox, background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <TrendingUp size={24} color="#10b981" />
            </div>
            <div>
              <p style={styles.metricLabel}>Avg Match Score</p>
              <h3 style={{ ...styles.metricValue, color: '#10b981' }}>
                {totalCount > 0 ? `${avgScore}%` : '—'}
              </h3>
            </div>
          </div>

          <div className="glass-panel" style={styles.metricCard}>
            <div style={{ ...styles.metricIconBox, background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <Award size={24} color="#f59e0b" />
            </div>
            <div>
              <p style={styles.metricLabel}>Highest Match</p>
              <h3 style={{ ...styles.metricValue, color: '#f59e0b' }}>
                {totalCount > 0 ? `${bestScore}%` : '—'}
              </h3>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchBarWrapper}>
          <div style={styles.searchBox}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search previous evaluations by role keywords or requirements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <Loader2 size={32} color="#818cf8" className="animate-spin" style={{ margin: '0 auto 0.85rem' }} />
            <p>Loading your ATS evaluation history...</p>
          </div>
        ) : totalCount === 0 ? (
          <div className="glass-panel" style={styles.emptyState}>
            <div style={styles.emptyIconCircle}>
              <FolderPlus size={36} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.45rem' }}>
              No evaluations on record
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: '1.5' }}>
              Upload your resume and screen your first job description to view intelligent matching insights here.
            </p>
            <button style={styles.primaryBtn} onClick={() => navigate('/upload')}>
              <Plus size={18} />
              <span>Upload Resume to Start</span>
            </button>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
            <p>No evaluations match your search query: "{searchTerm}".</p>
          </div>
        ) : (
          <div style={styles.historyList}>
            {filteredAnalyses.map((item) => {
              const badge = getScoreBadgeConfig(item.matchScore);
              return (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={styles.historyCard}
                  onClick={() => navigate(`/analysis/${item.id}`)}
                >
                  <div style={styles.cardLeft}>
                    <div
                      style={{
                        ...styles.scoreBadge,
                        background: badge.bg,
                        borderColor: badge.border,
                        color: badge.text,
                        boxShadow: `0 0 15px -3px ${badge.glow}`,
                      }}
                    >
                      <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                        {item.matchScore}%
                      </span>
                      <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
                        Score
                      </span>
                    </div>
                  </div>

                  <div style={styles.cardCenter}>
                    <p style={styles.jdSnippet}>
                      {item.jobDescription
                        ? item.jobDescription.substring(0, 150) + '...'
                        : 'No description text'}
                    </p>
                    <div style={styles.cardMeta}>
                      <Calendar size={13} color="#64748b" />
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
                      <span>Report</span>
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
    maxWidth: '1050px',
    margin: '2rem auto',
    padding: '0 1.5rem',
  },
  heroSection: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
    gap: '1.25rem',
  },
  badgePill: {
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
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.98rem',
    color: '#94a3b8',
    marginTop: '0.35rem',
    maxWidth: '620px',
    lineHeight: '1.5',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 1.45rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
    transition: 'all 0.2s ease',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2.25rem',
  },
  metricCard: {
    padding: '1.35rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.15rem',
  },
  metricIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  metricValue: {
    fontSize: '1.65rem',
    fontWeight: '800',
    color: '#ffffff',
    marginTop: '0.15rem',
  },
  searchBarWrapper: {
    marginBottom: '1.75rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '0.85rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '0.95rem',
    color: '#ffffff',
    background: 'transparent',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  historyCard: {
    padding: '1.35rem 1.65rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.65rem',
    cursor: 'pointer',
  },
  cardLeft: {
    flexShrink: 0,
  },
  scoreBadge: {
    width: '64px',
    height: '64px',
    borderRadius: '14px',
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
    color: '#cbd5e1',
    fontWeight: '500',
    lineHeight: '1.5',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.82rem',
    color: '#64748b',
    marginTop: '0.45rem',
  },
  cardRight: {
    flexShrink: 0,
  },
  viewDetailBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.95rem',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#a5b4fc',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  emptyState: {
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  emptyIconCircle: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)',
  },
};
