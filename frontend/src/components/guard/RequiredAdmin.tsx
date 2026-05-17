import { useAuthStore } from '@/lib/useAuthStore'
import { Navigate, Outlet } from 'react-router-dom'

export function RequireAdmin() {
	const { isLoggedIn, isAdmin } = useAuthStore()
	if (!isLoggedIn()) {
		return <Navigate to="/auth/login" replace />
	}

	if (!isAdmin()) {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}
