import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>🎯 Resume Screener</Link>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/upload" style={styles.link}>Upload</Link>
        <Link to="/analyze" style={styles.link}>Analyze</Link>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  logo: { fontWeight: 'bold', fontSize: '1.2rem', color: '#4f46e5', textDecoration: 'none' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: '#4a5568', textDecoration: 'none', fontWeight: '500' },
  logout: { background: 'none', border: '1px solid #e2e8f0', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', color: '#718096' },
};
