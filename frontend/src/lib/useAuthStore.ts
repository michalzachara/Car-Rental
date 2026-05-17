import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginUser, registerUser } from '@/api/auth.js'

export type User = {
	id: string
	name: string
	email: string
	role: string
}

export type AuthState = {
	user: User | null
	token: string | null

	login: (data: { email: string; password: string }) => Promise<void>
	register: (data: { name: string; email: string; password: string }) => Promise<void>
	logout: () => void
	isLoggedIn: () => boolean
	isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,

			login: async data => {
				try {
					const res = await loginUser(data)

					if (!res?.success) {
						throw new Error(res?.message || 'Login failed')
					}

					if (!res.user || !res.token) {
						throw new Error('Invalid server response')
					}

					set({
						user: res.user,
						token: res.token,
					})
				} catch (err) {
					console.error('Login error:', err)
					throw err
				}
			},

			register: async data => {
				try {
					const res = await registerUser(data)

					if (!res?.success) {
						throw new Error(res?.message || 'Register failed')
					}
				} catch (err) {
					console.error('Register error:', err)
					throw err
				}
			},

			logout: () =>
				set({
					user: null,
					token: null,
				}),

			isLoggedIn: () => !!get().token,
			isAdmin: () => get().user?.role === 'admin',
		}),
		{
			name: 'auth-storage',
		},
	),
)
