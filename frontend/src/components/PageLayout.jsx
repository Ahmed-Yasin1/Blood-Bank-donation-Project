import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const links = [
  ['dashboard', 'Dashboard'],
  ['donors', 'Donors'],
  ['hospitals', 'Hospitals'],
  ['inventory', 'Inventory'],
  ['emergency-requests', 'Emergency requests'],
  ['notifications', 'Notifications'],
  ['reports', 'Reports'],
]

export function PageLayout({ title, description, actions, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">+</span><span>BloodLink</span></div>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map(([path, label]) => <NavLink key={path} to={`/${path}`} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}
        </nav>
        <button className="logout-button" onClick={handleLogout}>Sign out</button>
      </aside>
      <main className="main-content">
        <header className="topbar"><span>Operations console</span><span className="user-chip">{user?.email || 'Authenticated user'}</span></header>
        <section className="page-heading"><div><p className="eyebrow">Blood management</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</section>
        {children}
      </main>
    </div>
  )
}

export function LoadingState({ message = 'Loading data...' }) { return <div className="panel muted">{message}</div> }
export function ErrorState({ message }) { return <div className="panel error-message">{message}</div> }
export function EmptyState({ message }) { return <div className="panel muted">{message}</div> }
export function StatCard({ label, value, tone = '' }) { return <div className={`stat-card ${tone}`}><span>{label}</span><strong>{value ?? 0}</strong></div> }
export function formatDate(value) { return value ? new Date(value).toLocaleDateString() : '—' }
