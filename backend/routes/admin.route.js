import { Router } from 'express'
import { adminOnly, isLoggedIn } from '../middleware/auth.js'
import {
	addCar,
	deleteCar,
	getActiveReservationsAdmin,
	getAllCars,
	getAllReservationsAdmin,
	getCarById,
	getReservationHistoryAdmin,
	updateCar,
} from '../controllers/admin.controller.js'

const router = Router()

router.get('/reservations', isLoggedIn, adminOnly, getAllReservationsAdmin)
router.get('/reservations/history', isLoggedIn, adminOnly, getReservationHistoryAdmin)
router.get('/reservations/active', isLoggedIn, adminOnly, getActiveReservationsAdmin)

router.post('/cars', isLoggedIn, adminOnly, addCar)
router.get('/all-cars', isLoggedIn, adminOnly, getAllCars)
router.get('/cars/:id', isLoggedIn, adminOnly, getCarById)
router.put('/cars/:id', isLoggedIn, adminOnly, updateCar)
router.delete('/cars/:id', isLoggedIn, adminOnly, deleteCar)

export default router
