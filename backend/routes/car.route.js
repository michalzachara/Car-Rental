import { Router } from "express"
import { cancelReservation, createReservation, getCarById, getCars } from "../controllers/car.controller.js";
import { isLoggedIn } from "../middleware/auth.js";

const router = Router();

router.get("/", getCars)
router.get("/:id", isLoggedIn, getCarById)
router.post("/reservation", isLoggedIn, createReservation);
router.post("/delete-reservation", isLoggedIn, cancelReservation)

export default router;