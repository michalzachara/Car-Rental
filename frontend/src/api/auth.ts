const API_URL = '/api/auth'

export async function loginUser(data: { email: string; password: string }) {
	const res = await fetch(`${API_URL}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})

	return res.json()
}

export async function registerUser(data: { name: string; email: string; password: string }) {
	const res = await fetch(`${API_URL}/signup`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})

	return res.json()
}
