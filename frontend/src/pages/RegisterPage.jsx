import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cardContainer}>
        {/* Header Branding */}
        <div style={styles.brandHeader}>
          <div style={styles.brandIcon}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Start scoring resumes against real job descriptions</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={styles.errorBanner}>
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.9rem', color: '#991b1b' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#94a3b8" style={styles.fieldIcon} />
              <input
                style={styles.input}
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#94a3b8" style={styles.fieldIcon} />
              <input
                style={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Get Started Free</span>
                <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Already registered?</span>{' '}
          <Link to="/login" style={styles.footerLink}>
            Sign in here
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
    background: 'radial-gradient(circle at 50% 0%, #ede9fe 0%, #f8fafc 60%)',
    padding: '1.5rem',
  },
  cardContainer: {
    background: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px #e2e8f0',
    width: '100%',
    maxWidth: '420px',
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '1.75rem',
  },
  brandIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 20px rgba(79, 70, 229, 0.25)',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.65rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
    marginBottom: '0.35rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#64748b',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    background: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    marginBottom: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.15rem',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '0.45rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  fieldIcon: {
    position: 'absolute',
    left: '0.9rem',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.9rem 0.75rem 2.6rem',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#0f172a',
    outline: 'none',
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
    padding: '0.85rem',
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.75rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid #f1f5f9',
  },
  footerLink: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
};
