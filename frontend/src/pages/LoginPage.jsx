import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div className="glass-panel" style={styles.cardContainer}>
        {/* Header */}
        <div style={styles.brandHeader}>
          <div style={styles.brandIcon}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your AI ATS evaluation account</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={styles.errorBanner}>
            <AlertCircle size={18} color="#f43f5e" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.88rem', color: '#fca5a5' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#64748b" style={styles.fieldIcon} />
              <input
                style={styles.input}
                type="email"
                placeholder="developer@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#64748b" style={styles.fieldIcon} />
              <input
                style={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </button>
            </div>
          </div>

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Don't have an account?</span>{' '}
          <Link to="/register" style={styles.footerLink}>
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  cardContainer: {
    padding: '2.5rem',
    width: '100%',
    maxWidth: '430px',
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '1.75rem',
  },
  brandIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
    marginBottom: '0.35rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    background: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
    marginBottom: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: '0.45rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  fieldIcon: {
    position: 'absolute',
    left: '1rem',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 2.75rem',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#ffffff',
    background: '#0f172a',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  eyeButton: {
    position: 'absolute',
    right: '0.85rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '0.2rem',
  },
  submitBtn: {
    marginTop: '0.5rem',
    padding: '0.9rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
    transition: 'opacity 0.2s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  footerLink: {
    color: '#a5b4fc',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
};
