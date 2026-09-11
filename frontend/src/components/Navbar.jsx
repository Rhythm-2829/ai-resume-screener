import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, FileUp, LineChart, History, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: History },
    { label: 'Upload', path: '/upload', icon: FileUp },
    { label: 'Analyze', path: '/analyze', icon: LineChart },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.logoGroup}>
          <div style={styles.logoIcon}>
            <Sparkles size={18} color="#ffffff" />
          </div>
          <div>
            <span style={styles.logoText}>Resume<span style={{ color: '#4f46e5' }}>AI</span></span>
            <span style={styles.badge}>ATS Screener</span>
          </div>
        </Link>

        <nav style={styles.navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {}),
                }}
              >
                <Icon size={16} color={isActive ? '#4f46e5' : '#64748b'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={styles.userSection}>
          <button onClick={logout} style={styles.logoutBtn} title="Sign Out">
            <LogOut size={16} />
            <span style={{ display: 'inline' }}>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #e2e8f0',
    width: '100%',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0.85rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#4f46e5',
    background: '#eef2ff',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    marginLeft: '0.5rem',
    verticalAlign: 'middle',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.9rem',
    borderRadius: '8px',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.15s ease',
  },
  activeLink: {
    color: '#4f46e5',
    background: '#f1f5f9',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    color: '#64748b',
    padding: '0.45rem 0.9rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
