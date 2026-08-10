import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import Dashboard from '../pages/Dashboard'
import Donors from '../pages/Donors'
import EmergencyRequests from '../pages/EmergencyRequests'
import Hospitals from '../pages/Hospitals'
import Inventory from '../pages/Inventory'
import Notifications from '../pages/Notifications'
import Reports from '../pages/Reports'
import Donations from '../pages/Donations'
import Users from '../pages/Users'
import Login from '../pages/Login'
import PrivateRoutes from './PrivateRoutes'

const privatePages = [
	{ path: 'dashboard', label: 'Dashboard', element: <Dashboard /> },
	{ path: 'donors', label: 'Donors', element: <Donors /> },
	{ path: 'donations', label: 'Donations', element: <Donations /> },
	{ path: 'emergency-requests', label: 'Emergency Requests', element: <EmergencyRequests /> },
	{ path: 'hospitals', label: 'Hospitals', element: <Hospitals /> },
	{ path: 'inventory', label: 'Inventory', element: <Inventory /> },
	{ path: 'notifications', label: 'Notifications', element: <Notifications /> },
	{ path: 'reports', label: 'Reports', element: <Reports /> },
	{ path: 'users', label: 'Users', element: <Users /> },
	{ path: 'aqurxi', label: 'Aad U Qurxi', element: <Dashboard /> },
]

function RouteScreen({ title, isPublic = false }) {
	return (
		<main className="container-fluid py-4">
			<div className="card shadow-sm border-0">
				<div className="card-body">
					<h1 className="h3 mb-3 text-danger">{title}</h1>
					{isPublic ? (
						<p className="text-muted">Sign in to access the blood management system.</p>
					) : (
						<p className="text-muted">This section is ready for its management tools.</p>
					)}
				</div>
			</div>
		</main>
	)
}

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route element={<PrivateRoutes />}>
				<Route element={<MainLayout />}>
					<Route index element={<Navigate to="/dashboard" replace />} />
					{privatePages.map((page) => (
						<Route key={page.path} path={page.path} element={page.element} />
					))}
				</Route>
			</Route>
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	)
}
