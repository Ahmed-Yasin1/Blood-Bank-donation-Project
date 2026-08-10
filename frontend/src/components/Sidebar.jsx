import { useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const navigationLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/donors', label: 'Donors' },
  { to: '/emergency-requests', label: 'Emergency Requests' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/reports', label: 'Reports' },
  { to: '/users', label: 'Users' },
]

export default function Sidebar() {
  const { sidebarOpen } = useAppContext()
  const navigate = useNavigate()

  const currentUser = useMemo(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  if (!sidebarOpen) {
    return null
  }

  const isAdmin = currentUser?.role === 'admin'

  return (
    <aside className="bg-white border-end shadow-sm p-3" style={{ width: '270px', minHeight: 'calc(100vh - 56px)' }}>
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
            🩸
          </div>
          <div>
            <h6 className="mb-0 fw-bold">Blood Bank</h6>
            <small className="text-muted">Operations Panel</small>
          </div>
        </div>

        <div className="list-group mt-3">
          {navigationLinks
            .filter((link) => link.to !== 'users' || isAdmin)
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `list-group-item list-group-item-action border-0 rounded-3 mb-1 ${
                    isActive ? 'active bg-danger text-white' : 'text-dark'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </div>
      </div>


      <div className="border rounded-3 p-3 bg-light">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            U
          </div>
          <div>
            <div className="fw-semibold text-danger small">{currentUser?.email || 'Guest User'}</div>
            <div className="small text-muted">{currentUser?.role || 'System User'}</div>
          </div>
        </div>
        <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  )
}
