const API_URL = '/api/admin'


export interface Car {
	_id: string
	brand: string
	model: string
	category: 'miejskie' | 'kompaktowe' | 'SUV' | 'rodzinne' | 'premium' | 'dostawcze'
	productionYear: number
	fuelType: 'gaz' | 'benzyna' | 'disel'
	gearbox?: 'manual' | 'automatyczna'
	seats: number
	pricePerHour: number
	picture: string
	createdAt: string
	updatedAt: string
}

export interface PopulatedUser {
	_id: string
	name: string
	email: string
}

export interface Reservation {
	_id: string
	user: PopulatedUser
	car: Car
	startDate: string
	endDate: string
	status: 'aktywna' | 'anulowana' | 'zakonczona'
	priceSummary: number
	createdAt: string
	updatedAt: string
}

// Typy dla odpowiedzi z API
export interface ApiResponse<T> {
	success: boolean
	count?: number
	message?: string
	data?: T
}

// --- REZERWACJE ---

export async function getAllReservationsAdmin(token: string): Promise<ApiResponse<Reservation[]>> {
	const res = await fetch(`${API_URL}/reservations`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	return res.json()
}

export async function getReservationHistoryAdmin(token: string): Promise<ApiResponse<Reservation[]>> {
	const res = await fetch(`${API_URL}/reservations/history`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	return res.json()
}

export async function getActiveReservationsAdmin(token: string): Promise<ApiResponse<Reservation[]>> {
	const res = await fetch(`${API_URL}/reservations/active`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	return res.json()
}

// --- SAMOCHODY ---

// Typ dla danych wysyłanych przy tworzeniu auta (bez pól generowanych przez MongoDB)
export type CreateCarData = Omit<Car, '_id' | 'createdAt' | 'updatedAt'>

export async function addCar(data: CreateCarData, token: string): Promise<ApiResponse<Car>> {
	const res = await fetch(`${API_URL}/cars`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
	return res.json()
}

export async function deleteCar(id: string, token: string): Promise<ApiResponse<null>> {
	const res = await fetch(`${API_URL}/cars/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	return res.json()
}