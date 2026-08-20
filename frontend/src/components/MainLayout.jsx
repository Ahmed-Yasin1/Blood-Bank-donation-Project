import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function MainLayout() {
  return (
    <div className="app-layout min-vh-100 bg-light">
      <Navbar />
      <div className="app-body d-flex">
        <Sidebar />
        <main className="app-main flex-grow-1 p-3">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
