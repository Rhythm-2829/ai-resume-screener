import React from 'react';
import {
  X,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';
import ScoreBadge from './ScoreBadge';

export default function CompareModal({ isOpen, onClose, analysisA, analysisB }) {
  if (!isOpen || !analysisA || !analysisB) return null;

  const parseJson = (str) => {
    if (!str) return [];
    try {
      return typeof str === 'string' ? JSON.parse(str) : str;
    } catch {
      return [];
    }
  };

  const scoreA = analysisA.matchScore || 0;
  const scoreB = analysisB.matchScore || 0;
  const delta = scoreB - scoreA;

  const strengthsA = parseJson(analysisA.strengths);
  const strengthsB = parseJson(analysisB.strengths);

  const gapsA = parseJson(analysisA.skillGaps);
  const gapsB = parseJson(analysisB.skillGaps);

  const suggestionsA = parseJson(analysisA.suggestions);
  const suggestionsB = parseJson(analysisB.suggestions);

  // Determine newly gained strengths in B
  const gainedStrengths = strengthsB.filter(
    (s) => !strengthsA.some((old) => old.toLowerCase() === s.toLowerCase())
  );

  // Determine gaps resolved in B
  const resolvedGaps = gapsA.filter(
    (g) => !gapsB.some((newGap) => newGap.toLowerCase() === g.toLowerCase())
  );

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        className="glass-panel animate-fade-in"
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.modalBadge}>
              <Layers size={13} color="#818cf8" />
              <span>Side-by-Side ATS Comparison</span>
            </div>
            <h2 style={styles.modalTitle}>Resume Evolution Diagnostics</h2>
            <p style={styles.modalSubtitle}>
              Direct comparison of candidate qualifications and ATS match scores between two evaluations.
            </p>
          </div>
          <button style={styles.closeBtn} onClick={onClose} title="Close Comparison">
            <X size={20} color="#94a3b8" />
          </button>
        </div>

        {/* Delta Hero Banner */}
        <div style={styles.deltaHeroBanner}>
          {/* Version A Card */}
          <div style={styles.versionCol}>
            <span style={styles.versionTagA}>Version A • #{analysisA.id}</span>
            <ScoreBadge score={scoreA} size={100} />
            <p style={styles.jdSnippet}>
              "{analysisA.jobDescription?.slice(0, 50)}..."
            </p>
          </div>

          {/* Delta Center Indicator */}
          <div style={styles.deltaCenter}>
            <div
              style={{
                ...styles.deltaPill,
                background: delta >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                border: `1px solid ${delta >= 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
                color: delta >= 0 ? '#34d399' : '#fca5a5',
              }}
            >
              <TrendingUp size={16} />
              <span>{delta >= 0 ? `+${delta}% ATS Gain` : `${delta}% ATS Drop`}</span>
            </div>
            <ArrowRight size={24} color="#818cf8" style={{ marginTop: '0.4rem' }} />
          </div>

          {/* Version B Card */}
          <div style={styles.versionCol}>
            <span style={styles.versionTagB}>Version B • #{analysisB.id}</span>
            <ScoreBadge score={scoreB} size={100} />
            <p style={styles.jdSnippet}>
              "{analysisB.jobDescription?.slice(0, 50)}..."
            </p>
          </div>
        </div>

        {/* Comparison Details Grid */}
        <div style={styles.detailsGrid}>
          {/* Resolved Gaps */}
          <div className="glass-panel" style={styles.detailCard}>
            <div style={styles.cardHeader}>
              <CheckCircle2 size={18} color="#10b981" />
              <h4 style={{ color: '#10b981', fontSize: '0.95rem', fontWeight: '700' }}>
                Skill Gaps Resolved ({resolvedGaps.length})
              </h4>
            </div>
            {resolvedGaps.length === 0 ? (
              <p style={styles.emptyNote}>No previous skill gaps were resolved in Version B.</p>
            ) : (
              <ul style={styles.list}>
                {resolvedGaps.map((g, idx) => (
                  <li key={idx} style={styles.resolvedItem}>
                    <Check size={14} color="#10b981" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Newly Gained Strengths */}
          <div className="glass-panel" style={styles.detailCard}>
            <div style={styles.cardHeader}>
              <Sparkles size={18} color="#818cf8" />
              <h4 style={{ color: '#a5b4fc', fontSize: '0.95rem', fontWeight: '700' }}>
                New Strengths Unlocked ({gainedStrengths.length})
              </h4>
            </div>
            {gainedStrengths.length === 0 ? (
              <p style={styles.emptyNote}>Both versions share identical verified strengths.</p>
            ) : (
              <ul style={styles.list}>
                {gainedStrengths.map((s, idx) => (
                  <li key={idx} style={styles.gainedItem}>
                    <span style={styles.purpleDot} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Summary Comparison */}
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
            Recruiter Summary Comparison
          </h4>
          <div style={styles.summaryRow}>
            <div style={styles.summaryBox}>
              <span style={styles.summaryLabel}>Version A Assessment:</span>
              <p style={styles.summaryText}>{analysisA.summary || 'No summary recorded.'}</p>
            </div>
            <div style={styles.summaryBox}>
              <span style={{ ...styles.summaryLabel, color: '#38bdf8' }}>Version B Assessment:</span>
              <p style={styles.summaryText}>{analysisB.summary || 'No summary recorded.'}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={styles.modalFooter}>
          <button style={styles.closeBtnFooter} onClick={onClose}>
            Close Comparison View
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(10, 15, 29, 0.85)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1.5rem',
  },
  modal: {
    maxWidth: '860px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'rgba(15, 23, 42, 0.95)',
    borderRadius: '20px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    padding: '2rem',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  modalBadge: {
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
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '0.4rem',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  modalSubtitle: {
    fontSize: '0.88rem',
    color: '#94a3b8',
    marginTop: '0.2rem',
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  deltaHeroBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    background: 'rgba(10, 15, 29, 0.6)',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  versionCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
    minWidth: '160px',
  },
  versionTagA: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#94a3b8',
    background: 'rgba(255, 255, 255, 0.06)',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
  },
  versionTagB: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#818cf8',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
  },
  jdSnippet: {
    fontSize: '0.78rem',
    color: '#64748b',
    textAlign: 'center',
    marginTop: '0.2rem',
    maxWidth: '180px',
  },
  deltaCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deltaPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.5rem 1.15rem',
    borderRadius: '9999px',
    fontSize: '0.92rem',
    fontWeight: '800',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem',
    marginTop: '1.5rem',
  },
  detailCard: {
    padding: '1.25rem',
    borderRadius: '12px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.85rem',
  },
  emptyNote: {
    fontSize: '0.82rem',
    color: '#64748b',
    fontStyle: 'italic',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  resolvedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#d1fae5',
  },
  gainedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#e0e7ff',
  },
  purpleDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#818cf8',
    flexShrink: 0,
  },
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  summaryBox: {
    background: 'rgba(10, 15, 29, 0.6)',
    padding: '0.9rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  summaryLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  summaryText: {
    fontSize: '0.85rem',
    color: '#cbd5e1',
    marginTop: '0.35rem',
    lineHeight: '1.5',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  closeBtnFooter: {
    padding: '0.65rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
  },
};
