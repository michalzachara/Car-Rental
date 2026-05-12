import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type User = {
	id: string
	name: string
	email: string
	role: string
}

export type AuthState = {
	user: User | null
	token: string | null

	login: (user: User, token: string) => void
	logout: () => void
	isLoggedIn: () => boolean
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,

			login: (user, token) =>
				set({
					user,
					token,
				}),

			logout: () =>
				set({
					user: null,
					token: null,
				}),

			isLoggedIn: () => {
				return get().user !== null
			},
		}),
		{
			name: 'auth-storage',
		},
	),
)
