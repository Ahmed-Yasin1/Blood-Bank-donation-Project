import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import useAuth from '../hooks/useAuth'
import { getHospital, updateHospital } from '../api/HospitalApi'
import { DISTRICTS } from '../constants/districts'

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
  const { user: currentUser } = useAuth()
  const [hospitalProfile, setHospitalProfile] = useState(null)
  const [district, setDistrict] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const userId = currentUser?.id || currentUser?._id
  const isHospital = currentUser?.role === 'hospital'
  const isDonor = currentUser?.role === 'donor'
  const isAdmin = currentUser?.role === 'admin'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    if (!isHospital || !userId) return

    const loadHospital = async () => {
      try {
        const response = await getHospital(userId)
        const data = response?.data || response
        setHospitalProfile(data)
        setDistrict(data?.district || '')
      } catch {
        setHospitalProfile(null)
      }
    }

    loadHospital()
  }, [isHospital, userId])

  const handleSaveDistrict = async (e) => {
    e.preventDefault()
    if (!isHospital || !userId) return

    try {
      setSaving(true)
      setError(null)
      const response = await updateHospital(userId, { district })
      const data = response?.data?.hospital || response?.data || response
      setHospitalProfile(data)
      setDistrict(data?.district || '')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Unable to update district')
    } finally {
      setSaving(false)
    }
  }

  const visibleLinks = navigationLinks.filter((link) => {
    if (isDonor) {
      return link.to === '/notifications' || link.to === '/donations'
    }

    if (isHospital) {
      return [
        '/dashboard',
        '/donors',
        '/emergency-requests',
        '/inventory',
        '/notifications',
        '/reports',
        '/donations'
      ].includes(link.to)
    }

    if (!isAdmin) {
      return link.to !== '/users'
    }

    return true
  })

  if (!sidebarOpen) {
    return null
  }

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
          {visibleLinks.map((link) => (
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
            <div className="fw-semibold text-danger small">{currentUser?.name || currentUser?.username || currentUser?.email || 'Guest User'}</div>
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
