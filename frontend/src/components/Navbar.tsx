import { Link } from 'react-router-dom'
import { ChangeThemeSwitch } from './toggle-mode'
import { useAuthStore } from '@/lib/useAuthStore'

export default function Navbar() {
	const user = useAuthStore(state => state.user)
	const logout = useAuthStore(state => state.logout)
	return (
		<nav>
			<Link to="/">Home</Link>
			<Link to="/admin">Admin</Link>

			{user ? (
				<>
					<p>Witaj {user.name}</p>
					<button onClick={logout}>Wyloguj</button>
				</>
			) : (
				<p>Nie zalogowano</p>
			)}

			<ChangeThemeSwitch />
		</nav>
	)
}
