import { useAuthStore } from '@/lib/useAuthStore'
import { Navigate, Outlet } from 'react-router-dom'

export function RequireAuth() {
	const { isLoggedIn } = useAuthStore()
	if (!isLoggedIn()) {
		return <Navigate to="/auth/login" replace />
	}

	return <Outlet />
}
