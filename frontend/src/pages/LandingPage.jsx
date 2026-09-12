import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Database,
  Cpu,
  Layers,
  TrendingUp,
  CheckCircle2,
  FileText,
  Check,
  ChevronRight,
  Star,
  Lock,
  FileCheck,
  Lightbulb,
  Gauge,
  GitBranch,
  Award,
} from 'lucide-react';
import ScoreBadge from '../components/ScoreBadge';

export default function LandingPage() {
  const navigate = useNavigate();
  const [demoState, setDemoState] = useState('after'); // 'before' | 'after'
  const token = localStorage.getItem('token');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#f8fafc', overflowX: 'hidden' }}>
      {/* Top Navigation */}
      <header style={styles.navHeader}>
        <div style={styles.navContainer}>
          <div style={styles.logoGroup} onClick={() => navigate('/')}>
            <div style={styles.logoIcon}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <span style={styles.logoText}>ResumeAI <span style={styles.logoSubText}>ATS</span></span>
          </div>

          <nav style={styles.navLinks}>
            <a href="#how-it-works" style={styles.navLink}>How It Works</a>
            <a href="#demo" style={styles.navLink}>Live Demo</a>
            <a href="#architecture" style={styles.navLink}>Tech Stack</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {token ? (
              <button style={styles.primaryBtn} onClick={() => navigate('/dashboard')}>
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button style={styles.ghostBtn} onClick={() => navigate('/login')}>
                  Sign In
                </button>
                <button style={styles.primaryBtn} onClick={() => navigate('/register')}>
                  <span>Get Started Free</span>
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          {/* Badge */}
          <div style={styles.heroBadge} className="animate-fade-in">
            <span style={styles.pulseDot} />
            <span>High-Speed AI ATS Diagnostic & Optimization Platform</span>
          </div>

          {/* Headline */}
          <h1 style={styles.heroHeadline}>
            Land 3x More Interviews With <br />
            <span style={styles.heroGradientText}>AI-Powered ATS Screening</span>
          </h1>

          <p style={styles.heroSubhead}>
            Stop guessing why recruiters reject your resume. Benchmark your qualifications against real job specifications in seconds. Get instant recruiter match scores, keyword gap detection, and metric-driven bullet point rewrites.
          </p>

          {/* CTAs */}
          <div style={styles.heroCtaRow}>
            <button
              style={styles.heroPrimaryBtn}
              onClick={() => navigate(token ? '/analyze' : '/register')}
            >
              <Sparkles size={18} />
              <span>Start Free Evaluation</span>
            </button>
            <a href="#demo" style={styles.heroSecondaryBtn}>
              <span>View Interactive Demo</span>
              <ChevronRight size={18} />
            </a>
          </div>

          {/* Proof Badges */}
          <div style={styles.proofStrip}>
            <div style={styles.proofItem}>
              <Zap size={16} color="#818cf8" />
              <span><strong>&lt;10ms</strong> Redis Caching</span>
            </div>
            <div style={styles.proofDivider} />
            <div style={styles.proofItem}>
              <ShieldCheck size={16} color="#10b981" />
              <span><strong>Resilience4j</strong> Fault Tolerance</span>
            </div>
            <div style={styles.proofDivider} />
            <div style={styles.proofItem}>
              <Cpu size={16} color="#a855f7" />
              <span><strong>Groq LLM</strong> Sub-4s Inference</span>
            </div>
            <div style={styles.proofDivider} />
            <div style={styles.proofItem}>
              <Lock size={16} color="#38bdf8" />
              <span><strong>Zero-Penalty</strong> Quota Guard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Showcase Section */}
      <section id="demo" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Interactive Demo</span>
            <h2 style={styles.sectionTitle}>See the Before & After Transformation</h2>
            <p style={styles.sectionSubtitle}>
              Experience how our deterministic keyword matcher and bullet rewriter elevate candidate profiles from automatic ATS rejection to interview shortlist.
            </p>
          </div>

          {/* Interactive Comparison Card */}
          <div className="glass-panel" style={styles.demoCard}>
            {/* Toggle Header */}
            <div style={styles.demoToggleBar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={18} color="#818cf8" />
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#e2e8f0' }}>
                  Target Role: <strong>Senior Java Backend Engineer</strong>
                </span>
              </div>

              <div style={styles.toggleButtonGroup}>
                <button
                  style={{
                    ...styles.toggleBtn,
                    ...(demoState === 'before' ? styles.toggleBtnActiveBefore : {}),
                  }}
                  onClick={() => setDemoState('before')}
                >
                  Original Resume (Before)
                </button>
                <button
                  style={{
                    ...styles.toggleBtn,
                    ...(demoState === 'after' ? styles.toggleBtnActiveAfter : {}),
                  }}
                  onClick={() => setDemoState('after')}
                >
                  ✨ AI Optimized (After)
                </button>
              </div>
            </div>

            {/* Demo Body Grid */}
            <div style={styles.demoGrid}>
              {/* Left Column: Score Badge & Diagnostics */}
              <div style={styles.demoScoreCol}>
                <ScoreBadge score={demoState === 'before' ? 56 : 91} size={140} />
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <span
                    style={{
                      ...styles.demoStatusPill,
                      background: demoState === 'before' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: demoState === 'before' ? '#f43f5e' : '#10b981',
                      border: `1px solid ${demoState === 'before' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                    }}
                  >
                    {demoState === 'before' ? '❌ High Rejection Risk' : '✅ ATS Shortlist Guaranteed'}
                  </span>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.6rem', lineHeight: '1.5' }}>
                    {demoState === 'before'
                      ? 'Candidate lacks explicit Redis caching, Spring Security, and metrics.'
                      : 'Candidate matches 100% of core JD keywords with quantifiable achievements.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Key Diagnostic Details */}
              <div style={styles.demoDetailsCol}>
                {/* Keywords */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={styles.demoSubheading}>ATS Keyword Alignment:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.4rem' }}>
                    <span style={styles.matchedTag}>✓ Java 17</span>
                    <span style={styles.matchedTag}>✓ Spring Boot</span>
                    {demoState === 'after' ? (
                      <>
                        <span style={styles.matchedTag}>✓ Redis Cache</span>
                        <span style={styles.matchedTag}>✓ Spring Security</span>
                        <span style={styles.matchedTag}>✓ Microservices</span>
                        <span style={styles.matchedTag}>✓ Docker</span>
                      </>
                    ) : (
                      <>
                        <span style={styles.missingTag}>✕ Redis (Missing)</span>
                        <span style={styles.missingTag}>✕ Spring Security (Missing)</span>
                        <span style={styles.missingTag}>✕ Microservices (Missing)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bullet Point Sample */}
                <div>
                  <span style={styles.demoSubheading}>Resume Bullet Optimization:</span>
                  <div style={styles.demoBulletBox}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: demoState === 'before' ? '#f43f5e' : '#34d399' }}>
                      {demoState === 'before' ? 'CURRENT WEAK BULLET:' : '✨ AI-REWRITTEN METRIC BULLET:'}
                    </span>
                    <p style={styles.demoBulletText}>
                      {demoState === 'before'
                        ? '"Worked on backend REST APIs and made database queries for customer portal."'
                        : '"Architected high-throughput Spring Boot REST microservices with Redis caching, reducing API latency by 42% and scaling to 150k daily active users."'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section id="how-it-works" style={{ ...styles.section, background: 'rgba(15, 23, 42, 0.4)' }}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Workflow Pipeline</span>
            <h2 style={styles.sectionTitle}>Three Steps to ATS Perfection</h2>
            <p style={styles.sectionSubtitle}>
              Our high-speed inference pipeline takes you from raw PDF to recruiter-ready application in under 5 seconds.
            </p>
          </div>

          <div style={styles.stepsGrid}>
            {/* Step 1 */}
            <div className="glass-panel" style={styles.stepCard}>
              <div style={styles.stepNumberBadge}>01</div>
              <div style={styles.stepIconBox}>
                <FileText size={24} color="#818cf8" />
              </div>
              <h3 style={styles.stepTitle}>In-Memory PDF Extraction</h3>
              <p style={styles.stepDesc}>
                Upload your resume PDF. Apache PDFBox extracts raw text structures in-memory with zero disk footprint for maximum candidate confidentiality.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel" style={styles.stepCard}>
              <div style={styles.stepNumberBadge}>02</div>
              <div style={styles.stepIconBox}>
                <Database size={24} color="#38bdf8" />
              </div>
              <h3 style={styles.stepTitle}>Deterministic Redis Caching</h3>
              <p style={styles.stepDesc}>
                A SHA-256 content hash checks Redis cache. Identical evaluations return in &lt;10ms; cache misses invoke high-speed Groq LLM inference.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel" style={styles.stepCard}>
              <div style={styles.stepNumberBadge}>03</div>
              <div style={styles.stepIconBox}>
                <Sparkles size={24} color="#a855f7" />
              </div>
              <h3 style={styles.stepTitle}>Diagnostics & Rewrites</h3>
              <p style={styles.stepDesc}>
                Receive a recruiter ATS score, verified strengths, missing keyword gaps, and 1-click copyable metric-driven bullet point rewrites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Tech Stack Showcase */}
      <section id="architecture" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>System Architecture</span>
            <h2 style={styles.sectionTitle}>Built Like a High-Performance SaaS</h2>
            <p style={styles.sectionSubtitle}>
              Engineered with resilience, deterministic caching, and enterprise fault tolerance patterns.
            </p>
          </div>

          <div style={styles.techGrid}>
            <div className="glass-panel" style={styles.techCard}>
              <div style={{ ...styles.techIcon, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <ShieldCheck size={24} color="#ef4444" />
              </div>
              <h4 style={styles.techTitle}>Resilience4j Circuit Breaker</h4>
              <p style={styles.techText}>
                5-call sliding window with 60% failure threshold and 15s hard ceiling. Upstream latency trips the circuit in &lt;10ms to prevent cascading system freeze.
              </p>
            </div>

            <div className="glass-panel" style={styles.techCard}>
              <div style={{ ...styles.techIcon, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <Zap size={24} color="#ef4444" />
              </div>
              <h4 style={styles.techTitle}>Redis Content Hashing</h4>
              <p style={styles.techText}>
                Deterministic SHA-256 fingerprinting of resume and job description. Subsequent runs return in sub-10ms with zero AI tokens consumed.
              </p>
            </div>

            <div className="glass-panel" style={styles.techCard}>
              <div style={{ ...styles.techIcon, background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <Cpu size={24} color="#a855f7" />
              </div>
              <h4 style={styles.techTitle}>Groq LLaMA / GPT-OSS</h4>
              <p style={styles.techText}>
                Ultra-low latency semantic inference using custom temperature prompts and rigid JSON schema enforcement for reproducible candidate ratings.
              </p>
            </div>

            <div className="glass-panel" style={styles.techCard}>
              <div style={{ ...styles.techIcon, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <Gauge size={24} color="#10b981" />
              </div>
              <h4 style={styles.techTitle}>Cost & Quota Governance</h4>
              <p style={styles.techText}>
                5 analyses/day rate limiting enforced at the database level with automatic midnight resets and zero-penalty protection when fallback triggers.
              </p>
            </div>

            <div className="glass-panel" style={styles.techCard}>
              <div style={{ ...styles.techIcon, background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <Lock size={24} color="#3b82f6" />
              </div>
              <h4 style={styles.techTitle}>Spring Security 7 + JWT</h4>
              <p style={styles.techText}>
                Stateless authentication architecture with BCrypt password hashing, custom authorization filter chains, and secure claims parsing.
              </p>
            </div>

            <div className="glass-panel" style={styles.techCard}>
              <div style={{ ...styles.techIcon, background: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                <TrendingUp size={24} color="#0ea5e9" />
              </div>
              <h4 style={styles.techTitle}>Recharts Progression Analytics</h4>
              <p style={styles.techText}>
                Visual candidate progression tracking over time, tracking your match scores against industry requirements on your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={styles.ctaSection}>
        <div style={styles.container}>
          <div className="glass-panel" style={styles.ctaCard}>
            <div style={styles.ctaBadge}>
              <Award size={14} color="#818cf8" />
              <span>Fast-Track Your Job Search</span>
            </div>
            <h2 style={styles.ctaTitle}>Ready to Beat the ATS Screener?</h2>
            <p style={styles.ctaSubtitle}>
              Join developers and tech professionals using deterministic AI diagnostics to polish their resumes and get hired faster.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
              <button
                style={styles.heroPrimaryBtn}
                onClick={() => navigate(token ? '/analyze' : '/register')}
              >
                <span>Get Started in 30 Seconds</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={styles.logoIcon}>
              <Sparkles size={16} color="#ffffff" />
            </div>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>ResumeAI ATS</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Full-Stack Spring Boot 4 • React 19 • Resilience4j • Redis • PostgreSQL • Groq AI
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a
              href="https://github.com/Rhythm-2829/ai-resume-screener"
              target="_blank"
              rel="noreferrer"
              style={styles.footerLink}
            >
              <GitBranch size={16} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  navHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(16px)',
    background: 'rgba(10, 15, 29, 0.85)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0.9rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
  },
  logoText: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  logoSubText: {
    color: '#818cf8',
    fontWeight: '700',
    fontSize: '0.85rem',
    marginLeft: '0.2rem',
  },
  navLinks: {
    display: 'flex',
    gap: '1.75rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
  ghostBtn: {
    padding: '0.55rem 1.15rem',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '8px',
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: '0.88rem',
    cursor: 'pointer',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.55rem 1.25rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.35)',
  },
  heroSection: {
    padding: '5rem 1.5rem 4rem',
    textAlign: 'center',
    background: 'radial-gradient(ellipse at top center, rgba(99, 102, 241, 0.15) 0%, rgba(10, 15, 29, 0) 70%)',
  },
  heroContainer: {
    maxWidth: '860px',
    margin: '0 auto',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.3rem 0.9rem',
    borderRadius: '9999px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.35)',
    color: '#a5b4fc',
    fontSize: '0.82rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
  },
  pulseDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#818cf8',
    boxShadow: '0 0 8px #818cf8',
  },
  heroHeadline: {
    fontSize: '3.4rem',
    fontWeight: '900',
    lineHeight: '1.15',
    color: '#ffffff',
    letterSpacing: '-0.03em',
    marginBottom: '1.25rem',
  },
  heroGradientText: {
    background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubhead: {
    fontSize: '1.12rem',
    color: '#94a3b8',
    lineHeight: '1.7',
    maxWidth: '720px',
    margin: '0 auto 2.25rem',
  },
  heroCtaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  heroPrimaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.9rem 2rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '1.02rem',
    cursor: 'pointer',
    boxShadow: '0 0 30px rgba(99, 102, 241, 0.45)',
  },
  heroSecondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.9rem 1.8rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontWeight: '600',
    fontSize: '0.95rem',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  proofStrip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    padding: '0.9rem 1.5rem',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  proofItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#cbd5e1',
  },
  proofDivider: {
    width: '1px',
    height: '18px',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    padding: '5rem 1.5rem',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  sectionTag: {
    display: 'inline-block',
    padding: '0.2rem 0.75rem',
    borderRadius: '9999px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#818cf8',
    fontSize: '0.78rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.75rem',
  },
  sectionTitle: {
    fontSize: '2.4rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
    marginBottom: '0.75rem',
  },
  sectionSubtitle: {
    fontSize: '1rem',
    color: '#94a3b8',
    maxWidth: '650px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  demoCard: {
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(15, 23, 42, 0.7)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  demoToggleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  toggleButtonGroup: {
    display: 'flex',
    background: 'rgba(10, 15, 29, 0.8)',
    padding: '0.25rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  toggleBtn: {
    padding: '0.5rem 1.15rem',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '0.85rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  toggleBtnActiveBefore: {
    background: 'rgba(244, 63, 94, 0.2)',
    color: '#fda4af',
    border: '1px solid rgba(244, 63, 94, 0.4)',
  },
  toggleBtnActiveAfter: {
    background: 'rgba(99, 102, 241, 0.25)',
    color: '#ffffff',
    border: '1px solid rgba(99, 102, 241, 0.45)',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.25)',
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '2.5rem',
    marginTop: '2rem',
    alignItems: 'center',
  },
  demoScoreCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingRight: '1.5rem',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
  },
  demoStatusPill: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.78rem',
    fontWeight: '700',
  },
  demoDetailsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  demoSubheading: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  matchedTag: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.35)',
    color: '#34d399',
    padding: '0.3rem 0.65rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  missingTag: {
    background: 'rgba(244, 63, 94, 0.15)',
    border: '1px solid rgba(244, 63, 94, 0.35)',
    color: '#fca5a5',
    padding: '0.3rem 0.65rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  demoBulletBox: {
    marginTop: '0.45rem',
    background: 'rgba(10, 15, 29, 0.7)',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  demoBulletText: {
    fontSize: '0.92rem',
    color: '#e2e8f0',
    lineHeight: '1.6',
    marginTop: '0.3rem',
    fontStyle: 'italic',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  stepCard: {
    position: 'relative',
    padding: '2.25rem',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  stepNumberBadge: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    fontSize: '2.5rem',
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.04)',
  },
  stepIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  stepTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.65rem',
  },
  stepDesc: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    lineHeight: '1.6',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.75rem',
  },
  techCard: {
    padding: '1.75rem',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  techIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  techTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  techText: {
    fontSize: '0.88rem',
    color: '#94a3b8',
    lineHeight: '1.6',
  },
  ctaSection: {
    padding: '4rem 1.5rem 6rem',
  },
  ctaCard: {
    textAlign: 'center',
    padding: '3.5rem 2rem',
    borderRadius: '20px',
    background: 'radial-gradient(ellipse at top center, rgba(99, 102, 241, 0.25), rgba(15, 23, 42, 0.9))',
    border: '1px solid rgba(99, 102, 241, 0.35)',
    boxShadow: '0 0 50px rgba(99, 102, 241, 0.2)',
  },
  ctaBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.25rem 0.8rem',
    borderRadius: '9999px',
    background: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    color: '#a5b4fc',
    fontSize: '0.8rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  ctaTitle: {
    fontSize: '2.6rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
    marginBottom: '0.85rem',
  },
  ctaSubtitle: {
    fontSize: '1.05rem',
    color: '#cbd5e1',
    maxWidth: '580px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '2rem 1.5rem',
    background: 'rgba(10, 15, 29, 0.95)',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  footerLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
};
