import express from "express";
import {
  getUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
  createMultipleUnits,
} from "../controllers/Units.js";

const router = express.Router();

router.get("/units", getUnits);
router.get("/units/:id", getUnitById);
router.post("/units", createUnit);
router.put("/units/:id", updateUnit);
router.delete("/units/:id", deleteUnit);
router.post("/units/bulk", createMultipleUnits); // Rute untuk menambahkan banyak unit sekaligus

export default router;
