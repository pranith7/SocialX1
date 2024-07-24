import express from "express";
import { ForgotPassword, ResetPassword} from "../controllers/forgotpass.contoller";

const router = Router()

router.post("/forgot-password", ForgotPassword)
router.post("/reset-password", ResetPassword)