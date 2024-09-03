import express from "express";
import {
  createJadwal,
  deleteJadwal,
  getJadwalById,
  getJadwals,
  getJadwalsByUser,
  getJenisRapat,
  updateJadwal,
} from "../controllers/Jadwals.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/jadwals/jenis-rapat", verifyToken, getJenisRapat);

router.get("/jadwals", verifyToken, getJadwals);
router.get("/jadwals/:id", verifyToken, getJadwalById);
router.get("/jadwals/:userId", verifyToken, getJadwalsByUser);
router.post("/jadwals", verifyToken, createJadwal);
router.put("/jadwals/:id", verifyToken, updateJadwal);
router.delete("/jadwals/:id", verifyToken, deleteJadwal);

export default router;
