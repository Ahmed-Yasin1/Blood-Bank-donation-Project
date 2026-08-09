import { useEffect } from 'react'
import Loading from './Loading'
import useAuth from '../hooks/useAuth'

export default function ProtectedRoute({ children, redirectTo = '/login' }) {
	const { isAuthenticated, isLoading } = useAuth()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			window.location.replace(redirectTo)
		}
	}, [isAuthenticated, isLoading, redirectTo])

	if (isLoading || !isAuthenticated) {
		return <Loading message={isLoading ? 'Checking your session...' : 'Redirecting...'} />
	}

	return children
}
