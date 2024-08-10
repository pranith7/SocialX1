import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import {} from 

const router = Router();

router.get('/',verifyJWT);

export default router;