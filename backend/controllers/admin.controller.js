import Reservation from '../models/reservation.model.js'
import Car from '../models/car.model.js'

export const getAllReservationsAdmin = async (req, res) => {
	try {
		const reservations = await Reservation.find().populate('user', 'name email').populate('car').sort({ createdAt: -1 })

		res.status(200).json({
			success: true,
			count: reservations.length,
			data: reservations,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Błąd serwera podczas pobierania rezerwacji',
		})
	}
}

export const getReservationHistoryAdmin = async (req, res) => {
	try {
		const history = await Reservation.find({ status: 'zakonczona' })
			.populate('user', 'name email')
			.populate('car')
			.sort({ createdAt: -1 })

		res.status(200).json({
			success: true,
			count: history.length,
			data: history,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Błąd serwera podczas pobierania historii rezerwacji',
		})
	}
}

export const getActiveReservationsAdmin = async (req, res) => {
	try {
		const active = await Reservation.find({ status: 'aktywna' })
			.populate('user', 'name email')
			.populate('car')
			.sort({ startDate: 1 })

		res.status(200).json({
			success: true,
			count: active.length,
			data: active,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Błąd serwera podczas pobierania aktywnych rezerwacji',
		})
	}
}

export const addCar = async (req, res) => {
	try {
		const { brand, model, category, productionYear, fuelType, gearbox, seats, pricePerDay, picture } = req.body

		if (!brand || !model || !category || !productionYear || !fuelType || !seats || !pricePerDay || !picture) {
			return res.status(400).json({
				success: false,
				message: 'Wszystkie wymagane pola muszą być uzupełnione',
			})
		}

		if (productionYear < 1900 || productionYear > new Date().getFullYear()) {
			return res.status(400).json({
				success: false,
				message: 'Niepoprawny rok produkcji',
			})
		}

		if (seats <= 0) {
			return res.status(400).json({
				success: false,
				message: 'Liczba miejsc musi być większa od 0',
			})
		}

		if (pricePerDay <= 0) {
			return res.status(400).json({
				success: false,
				message: 'Cena musi być większa od 0',
			})
		}

		const car = await Car.create({
			brand,
			model,
			category,
			productionYear,
			fuelType,
			gearbox,
			seats,
			pricePerDay,
			picture,
		})

		res.status(201).json({
			success: true,
			message: 'Auto zostało dodane',
			data: car,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Błąd podczas dodawania auta',
		})
	}
}

export const deleteCar = async (req, res) => {
	try {
		const { id } = req.params

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'Brak ID auta',
			})
		}

		const car = await Car.findById(id)

		if (!car) {
			return res.status(404).json({
				success: false,
				message: 'Auto nie istnieje',
			})
		}

		await Car.findByIdAndDelete(id)

		res.status(200).json({
			success: true,
			message: 'Auto zostało usunięte',
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Błąd podczas usuwania auta',
		})
	}
}