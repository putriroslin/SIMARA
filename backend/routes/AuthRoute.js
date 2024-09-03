import express from "express";
import { Login, Logout, Me } from "../controllers/Auth.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.post("/login", Login);
router.post("/token", refreshToken);
router.post("/logout", Logout);
router.get("/me", Me);

export default router;
