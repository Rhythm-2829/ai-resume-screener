import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, FileUp, LineChart, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
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
            <span style={styles.logoText}>Resume<span style={{ color: '#818cf8' }}>AI</span></span>
            <span style={styles.badge}>ATS Core</span>
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
                <Icon size={16} color={isActive ? '#818cf8' : '#94a3b8'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={styles.userSection}>
          <button onClick={logout} style={styles.logoutBtn} title="Sign Out">
            <LogOut size={15} />
            <span>Sign Out</span>
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
    background: 'rgba(9, 13, 22, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#a5b4fc',
    background: 'rgba(99, 102, 241, 0.18)',
    border: '1px solid rgba(99, 102, 241, 0.35)',
    padding: '0.1rem 0.45rem',
    borderRadius: '4px',
    marginLeft: '0.5rem',
    verticalAlign: 'middle',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '0.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.45rem 0.95rem',
    borderRadius: '9px',
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '0.88rem',
    transition: 'all 0.18s ease',
  },
  activeLink: {
    color: '#ffffff',
    background: 'rgba(99, 102, 241, 0.25)',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
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
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#cbd5e1',
    padding: '0.45rem 0.9rem',
    borderRadius: '9px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
};
