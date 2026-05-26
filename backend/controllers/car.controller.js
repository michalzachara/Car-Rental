import Car from '../models/car.model.js'
import Reservation from '../models/reservation.model.js'

export const getCars = async (req, res) => {
	try {
		const { startDate, endDate, search, category, fuelType, gearbox, minPrice, maxPrice } = req.query

		const filter = {}

		if (search) {
			filter.$or = [{ brand: { $regex: search, $options: 'i' } }, { model: { $regex: search, $options: 'i' } }]
		}
		if (category) filter.category = category
		if (fuelType) filter.fuelType = fuelType
		if (gearbox) filter.gearbox = gearbox
		if (minPrice || maxPrice) {
			filter.pricePerDay = {}
			if (minPrice) filter.pricePerDay.$gte = Number(minPrice)
			if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice)
		}

		if (!startDate) {
			const cars = await Car.find(filter).select(
				'picture brand model pricePerDay category fuelType gearbox seats productionYear',
			)
			return res.status(200).json({ success: true, cars })
		}

		const start = new Date(startDate)
		const end = endDate ? new Date(endDate) : start

		const reservedCars = await Reservation.find({
			status: 'aktywna',
			startDate: { $lte: end },
			endDate: { $gte: start },
		}).distinct('car')

		const cars = await Car.find({
			...filter,
			_id: { $nin: reservedCars },
		}).select('picture brand model pricePerDay category fuelType gearbox seats productionYear')
		res.status(200).json({ success: true, cars })
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}

export const getCarById = async (req, res) => {
	try {
		const { id } = req.params

		const car = await Car.findById(id)

		if (!car) {
			return res.status(404).json({ message: 'Auto nie znalezione', success: false })
		}

		res.status(200).json({ success: true, cars: car })
	} catch (error) {
		res.status(500).json({ message: error.message, success: false })
	}
}

export const createReservation = async (req, res) => {
	try {
		const { carId, startDate, endDate } = req.body
		const userId = req.user._id

		const car = await Car.findById(carId)
		if (!car) {
			return res.status(404).json({ message: 'Auto nie istnieje', success: false })
		}

		const overlappingReservation = await Reservation.findOne({
			car: carId,
			status: 'aktywna',
			$or: [
				{
					startDate: { $lte: new Date(endDate) },
					endDate: { $gte: new Date(startDate) },
				},
			],
		})

		if (overlappingReservation) {
			return res.status(400).json({
				message: 'Auto jest już zarezerwowane w tym terminie',
				success: false,
			})
		}

		const start = new Date(startDate)
		const end = new Date(endDate)

		const hours = Math.ceil((end - start) / (1000 * 60 * 60))
		const totalPrice = hours * car.pricePerDay

		const reservation = await Reservation.create({
			user: userId,
			car: carId,
			startDate,
			endDate,
			priceSummary: totalPrice,
		})

		res.status(201).json({ success: true, reservation })
	} catch (error) {
		res.status(500).json({ message: error.message, success: false })
	}
}

export const cancelReservation = async (req, res) => {
	try {
		const { reservationId } = req.body
		const userId = req.user._id

		const reservation = await Reservation.findById(reservationId)

		if (!reservation) {
			return res.status(404).json({ message: 'Rezerwacja nie istnieje', success: false })
		}

		if (reservation.user.toString() !== userId.toString()) {
			return res.status(403).json({ message: 'Brak dostępu', success: false })
		}

		if (reservation.status !== 'aktywna') {
			return res.status(400).json({
				message: 'Nie można anulować tej rezerwacji',
				success: false,
			})
		}

		reservation.status = 'anulowana'
		await reservation.save()

		res.json({ message: 'Rezerwacja anulowana', success: true })
	} catch (error) {
		res.status(500).json({ message: error.message, success: false })
	}
}
