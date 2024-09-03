// File: backend/routes/NotificationRoutes.js

import express from "express";
import { saveSubscription } from "../controllers/NotificationController.js";
// import { sendNotificationsToAll } from "../controllers/Notifications.js";

const router = express.Router();

// Route untuk menyimpan subscription dari frontend
router.post("/api/subscribe", saveSubscription);
// Route untuk mengirim notifikasi ke semua pengguna yang berlangganan
// router.post("/api/send-notifications", sendNotificationsToAll);

export default router;
