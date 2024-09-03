import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getStatuses,
  uploads,
  changePassword,
} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

//verifyToken utk memverifikasi endpoint yang tidak bisa diakses jika user belum login
router.get("/users/statuses", verifyToken, getStatuses);

router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.post("/users", verifyToken, createUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

router.post("/upload/:id", verifyToken, uploads);
router.post("/change-password", verifyToken, changePassword);

export default router;
