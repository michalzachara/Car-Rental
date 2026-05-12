import { Router } from "express"
import { createReservation, getCarById, getCars } from "../controllers/car.controller.js";
import { isLoggedIn } from "../middleware/auth.js";

const router = Router();

router.get("/", getCars)
router.get("/:id", isLoggedIn, getCarById)
router.post("/reservation", isLoggedIn, createReservation);
router.delete("/delete-reservation", isLoggedIn, createReservation)

export default router;