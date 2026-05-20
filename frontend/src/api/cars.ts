const API_URL = '/api/cars'

export type CarCategory = 'miejskie' | 'kompaktowe' | 'SUV' | 'rodzinne' | 'premium' | 'dostawcze'
export type FuelType = 'gaz' | 'benzyna' | 'disel'
export type GearboxType = 'manual' | 'automatyczna'

export interface Car {
	_id: string
	brand: string
	model: string
	category: CarCategory
	productionYear: number
	fuelType: FuelType
	gearbox?: GearboxType
	seats: number
	pricePerDay: number
	picture: string
	createdAt?: string
	updatedAt?: string
}

export interface Reservation {
	_id: string
	user: string
	car: string
	startDate: string
	endDate: string
	priceSummary: number
	status: 'aktywna' | 'anulowana' | string
	createdAt?: string
	updatedAt?: string
}

export interface CarsResponse {
	success: boolean
	cars: Car[]
}

export interface SingleCarResponse {
	success: boolean
	cars: Car
}

export interface ReservationResponse {
	success: boolean
	reservation: Reservation
}

export interface CancelResponse {
	success: boolean
	message: string
}

export interface GetCarsFilters {
  startDate?: string
  endDate?: string
  search?: string
  category?: CarCategory | ''
  fuelType?: FuelType | ''
  gearbox?: GearboxType | ''
  minPrice?: string
  maxPrice?: string
}

export const getCars = async (filters: GetCarsFilters = {}): Promise<CarsResponse> => {
  let url = API_URL
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString())
    }
  })

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Błąd pobierania aut: ${response.statusText}`)
  }

  return response.json()
}

export const getCarById = async (id: string, token: string | null): Promise<SingleCarResponse> => {
	const response = await fetch(`${API_URL}/${id}`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(errorData.message || `Błąd pobierania samochodu: ${response.statusText}`)
	}

	return response.json()
}

export const createReservation = async (
	carId: string,
	startDate: string,
	endDate: string,
	token?: string | null,
): Promise<ReservationResponse> => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	}

	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	const response = await fetch(`${API_URL}/reservation`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ carId, startDate, endDate }),
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(errorData.message || `Nie udało się utworzyć rezerwacji: ${response.statusText}`)
	}

	return response.json()
}

export const cancelReservation = async (reservationId: string, token?: string): Promise<CancelResponse> => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	}

	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	// Upewnij się, że ten endpoint (np. '/cancel') zgadza się z Twoim routerem Express
	const response = await fetch(`${API_URL}/cancel`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ reservationId }),
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(errorData.message || `Nie udało się anulować rezerwacji: ${response.statusText}`)
	}

	return response.json()
}
