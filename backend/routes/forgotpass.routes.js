import { Router } from "express";
import { ForgotPassword, ResetPassword } from "../controllers/forgotpass.controller.js";
const router = Router(); // Corrected the Router() to express.Router()

router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);

export default router;