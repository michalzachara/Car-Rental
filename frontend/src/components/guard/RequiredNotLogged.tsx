import { useAuthStore } from '@/lib/useAuthStore'
import { Navigate, Outlet } from 'react-router-dom'

export function RequireNotLogIn() {
	const { isLoggedIn } = useAuthStore()
	if (isLoggedIn()) {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}
