import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Filter,
  Layers,
  Sparkles,
  Check,
  X,
  FileCheck,
} from 'lucide-react';

export default function KeywordHeatmap({ jobDescription = '', strengths = [], skillGaps = [] }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'matched' | 'missing'

  // Clean strings from JSON or array
  const cleanStrengths = useMemo(() => {
    if (!strengths) return [];
    const list = Array.isArray(strengths) ? strengths : [];
    return list.map((s) => (typeof s === 'string' ? s.trim() : JSON.stringify(s)));
  }, [strengths]);

  const cleanGaps = useMemo(() => {
    if (!skillGaps) return [];
    const list = Array.isArray(skillGaps) ? skillGaps : [];
    return list.map((g) => (typeof g === 'string' ? g.trim() : JSON.stringify(g)));
  }, [skillGaps]);

  const totalKeywords = cleanStrengths.length + cleanGaps.length;
  const coveragePercent =
    totalKeywords > 0 ? Math.round((cleanStrengths.length / totalKeywords) * 100) : 0;

  // Build highlighted Job Description text
  const highlightedJD = useMemo(() => {
    if (!jobDescription) return null;

    // Build regex pattern for all keywords (escape special regex chars)
    const escapeRegex = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const allKeywords = [
      ...cleanStrengths.map((k) => ({ text: k, type: 'matched' })),
      ...cleanGaps.map((k) => ({ text: k, type: 'missing' })),
    ].filter((k) => k.text.length > 2);

    if (allKeywords.length === 0) return jobDescription;

    // Sort keywords by length descending to match longer multi-word phrases first
    allKeywords.sort((a, b) => b.text.length - a.text.length);

    const pattern = new RegExp(
      `\\b(${allKeywords.map((k) => escapeRegex(k.text)).join('|')})\\b`,
      'gi'
    );

    const parts = jobDescription.split(pattern);

    return parts.map((part, index) => {
      const matchedKw = allKeywords.find(
        (k) => k.text.toLowerCase() === part.toLowerCase()
      );

      if (!matchedKw) return <span key={index}>{part}</span>;

      if (matchedKw.type === 'matched') {
        return (
          <mark key={index} style={styles.highlightMatched}>
            ✓ {part}
          </mark>
        );
      } else {
        return (
          <mark key={index} style={styles.highlightMissing}>
            ✕ {part}
          </mark>
        );
      }
    });
  }, [jobDescription, cleanStrengths, cleanGaps]);

  return (
    <div className="glass-panel" style={styles.container}>
      {/* Header & Coverage Progress */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>
            <FileSearch size={13} color="#818cf8" />
            <span>ATS Keyword Heatmap & Density</span>
          </div>
          <h3 style={styles.title}>Job Description Technical Heatmap</h3>
          <p style={styles.subtitle}>
            Visual breakdown of requirements found in your resume (green) versus missing qualifications (amber).
          </p>
        </div>

        {/* Coverage Stat Box */}
        <div style={styles.coverageBox}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
              Keyword Coverage
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: '800',
                color: coveragePercent >= 75 ? '#10b981' : coveragePercent >= 50 ? '#f59e0b' : '#f43f5e',
              }}
            >
              {coveragePercent}% ({cleanStrengths.length}/{totalKeywords})
            </span>
          </div>
          {/* Progress Bar */}
          <div style={styles.progressBarTrack}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${coveragePercent}%`,
                background:
                  coveragePercent >= 75
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : 'linear-gradient(90deg, #f59e0b, #d97706)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>
          <Filter size={14} />
          <span>Filter View:</span>
        </div>
        <div style={styles.tabsWrapper}>
          <button
            style={{
              ...styles.filterBtn,
              ...(filterMode === 'all' ? styles.activeFilterBtn : {}),
            }}
            onClick={() => setFilterMode('all')}
          >
            All Keywords ({totalKeywords})
          </button>
          <button
            style={{
              ...styles.filterBtn,
              ...(filterMode === 'matched' ? styles.activeFilterBtnMatched : {}),
            }}
            onClick={() => setFilterMode('matched')}
          >
            ✓ Matched ({cleanStrengths.length})
          </button>
          <button
            style={{
              ...styles.filterBtn,
              ...(filterMode === 'missing' ? styles.activeFilterBtnMissing : {}),
            }}
            onClick={() => setFilterMode('missing')}
          >
            ✕ Missing Gaps ({cleanGaps.length})
          </button>
        </div>
      </div>

      {/* Keyword Cloud Matrix */}
      <div style={styles.cloudWrapper}>
        {(filterMode === 'all' || filterMode === 'matched') &&
          cleanStrengths.map((s, idx) => (
            <div key={`s-${idx}`} style={styles.tagMatched}>
              <Check size={13} color="#10b981" />
              <span>{s}</span>
            </div>
          ))}

        {(filterMode === 'all' || filterMode === 'missing') &&
          cleanGaps.map((g, idx) => (
            <div key={`g-${idx}`} style={styles.tagMissing}>
              <X size={13} color="#f43f5e" />
              <span>{g}</span>
            </div>
          ))}
      </div>

      {/* In-Context Text Highlighter Box */}
      <div style={styles.contextBox}>
        <div style={styles.contextHeader}>
          <FileCheck size={15} color="#818cf8" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1' }}>
            In-Context Job Description Highlight Analysis:
          </span>
        </div>
        <div style={styles.contextText}>
          {highlightedJD}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.75rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginTop: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#a5b4fc',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: '0.45rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginTop: '0.2rem',
  },
  coverageBox: {
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '0.85rem 1.15rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    minWidth: '220px',
  },
  progressBarTrack: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.4s ease',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
  },
  tabsWrapper: {
    display: 'flex',
    gap: '0.4rem',
    background: 'rgba(10, 15, 29, 0.6)',
    padding: '0.25rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  filterBtn: {
    padding: '0.35rem 0.85rem',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '0.8rem',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  activeFilterBtn: {
    background: 'rgba(99, 102, 241, 0.25)',
    color: '#ffffff',
    border: '1px solid rgba(99, 102, 241, 0.4)',
  },
  activeFilterBtnMatched: {
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#34d399',
    border: '1px solid rgba(16, 185, 129, 0.4)',
  },
  activeFilterBtnMissing: {
    background: 'rgba(244, 63, 94, 0.2)',
    color: '#fca5a5',
    border: '1px solid rgba(244, 63, 94, 0.4)',
  },
  cloudWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  tagMatched: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#34d399',
    fontSize: '0.82rem',
    fontWeight: '600',
  },
  tagMissing: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    background: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    color: '#fca5a5',
    fontSize: '0.82rem',
    fontWeight: '600',
  },
  contextBox: {
    background: 'rgba(10, 15, 29, 0.7)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '1.25rem',
  },
  contextHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    marginBottom: '0.85rem',
    paddingBottom: '0.65rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  contextText: {
    fontSize: '0.92rem',
    color: '#cbd5e1',
    lineHeight: '1.8',
  },
  highlightMatched: {
    background: 'rgba(16, 185, 129, 0.25)',
    color: '#34d399',
    padding: '0.15rem 0.45rem',
    borderRadius: '6px',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    fontWeight: '600',
    margin: '0 0.15rem',
  },
  highlightMissing: {
    background: 'rgba(244, 63, 94, 0.2)',
    color: '#fca5a5',
    padding: '0.15rem 0.45rem',
    borderRadius: '6px',
    border: '1px solid rgba(244, 63, 94, 0.4)',
    fontWeight: '600',
    margin: '0 0.15rem',
  },
};
