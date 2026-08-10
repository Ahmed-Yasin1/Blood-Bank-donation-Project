import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export default function Navbar() {
  const { toggleSidebar } = useAppContext()

  return (
    <nav className="navbar navbar-dark bg-danger shadow-sm sticky-top">
      <div className="container-fluid">
        <button
          className="btn btn-outline-light"
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <NavLink className="navbar-brand fw-semibold ms-2" to="/dashboard">
          Blood Bank Hub
        </NavLink>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <span className="badge bg-light text-danger">Live</span>
          <span className="navbar-text text-light d-none d-lg-inline">
            Donation Management
          </span>
        </div>
      </div>
    </nav>
  )
}
