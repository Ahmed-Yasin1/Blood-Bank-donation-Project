import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import PrivateRoutes from './PrivateRoutes'

const privatePages = [
	{ path: 'dashboard', label: 'Dashboard' },
	{ path: 'donors', label: 'Donors' },
	{ path: 'hospitals', label: 'Hospitals' },
	{ path: 'inventory', label: 'Inventory' },
	{ path: 'emergency-requests', label: 'Emergency Requests' },
	{ path: 'notifications', label: 'Notifications' },
	{ path: 'reports', label: 'Reports' },
]

function RouteScreen({ title, isPublic = false }) {
	return (
		<main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
			<h1>{title}</h1>
			{isPublic ? (
				<p>Sign in to access the blood management system.</p>
			) : (
				<>
					<p>This section is ready for its management tools.</p>
					<nav aria-label="Application navigation">
						{privatePages.map((page) => (
							<NavLink
								key={page.path}
								to={`/${page.path}`}
								style={{ display: 'block', marginTop: '0.5rem' }}
							>
								{page.label}
							</NavLink>
						))}
					</nav>
				</>
			)}
		</main>
	)
}

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<RouteScreen title="Sign in" isPublic />} />
				<Route element={<PrivateRoutes />}>
					<Route index element={<Navigate to="/dashboard" replace />} />
					{privatePages.map((page) => (
						<Route
							key={page.path}
							path={page.path}
							element={<RouteScreen title={page.label} />}
						/>
					))}
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	)
}
