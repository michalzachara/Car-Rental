import Reservation from '../models/reservation.model.js'

export const getMyReservations = async (req, res) => {
	try {
		const userId = req.user.id

		const reservations = await Reservation.find({ user: userId })
			.populate('car')
			.sort({ createdAt: -1 })

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