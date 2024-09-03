// File: backend/controllers/NotificationController.js

import Subscription from "../models/SubscriptionModel.js";
import { sendPushNotification } from "../services/pushNotification.js";

// Simpan subscription ke database
export const saveSubscription = async (req, res) => {
  try {
    const { subscription, userId } = req.body;

    // if (!subscription || !userId) {
    //   return res.status(400).json({ error: "Missing subscription or userId" });
    // }

    // Tambahkan logging untuk memeriksa data subscription yang diterima
    console.log("Received subscription:", subscription);
	console.log("Received userId:", userId);

    // if (!subscription || !subscription.endpoint || !subscription.keys) {
    //   throw new Error("Invalid subscription data");
    // }

    // Simpan subscription ke database, pastikan p256dh dan auth disimpan dengan benar
    const [savedSubscription, created] = await Subscription.findOrCreate({
      where: { endpoint: subscription.endpoint },
      defaults: {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: userId, // Menghubungkan subscription dengan pengguna yang login
      },
    });

    // Log untuk memastikan p256dh dan auth dikirim
    // console.log("Received subscription keys:", keys);

    if (created) {
      console.log("Subscription created successfully");
    } else {
      console.log("Subscription already exists");
    }

    // Kirim notifikasi welcome setelah subscription berhasil
    const notificationData = {
      title: "Welcome!",
      body: "You have successfully subscribed to push notifications.",
      icon: "/icon.png",
    };

    await sendPushNotification(subscription, notificationData); // Kirim push notification
    res.status(201).json({ message: "Subscription saved successfully." });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Failed to save subscription." });
  }
};
