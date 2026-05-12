import { Router } from "express"

import { isLoggedIn } from "../middleware/auth.js";
import { getMyReservations } from "../controllers/user.controller.js";

const router = Router();

router.get("/reservations", isLoggedIn, getMyReservations)


export default router;