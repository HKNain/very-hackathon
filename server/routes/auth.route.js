import express from "express";
import { login, logout, signup, userAccountDelete } from "../controllers/auth.controllers.js"
import protectRoute from "../middleware/protectRoute.middleware.js";


const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout",protectRoute, logout);

router.delete('/accountdelete',protectRoute,userAccountDelete)


export default router;