// // File: backend/controllers/Notifications.js
// import { getSubscriptionsFromDB } from "../services/SubscriptionService.js";
// import { sendPushNotification } from "../services/pushNotification.js";

// export const sendNotificationsToAll = async (req, res) => {
//   try {
//     // Ambil semua subscription dari database
//     const subscriptions = await getSubscriptionsFromDB();

//     const notificationData = {
//       title: "Broadcast Notification",
//       body: "This is a broadcast notification sent to all subscribers.",
//       icon: "/icon.png",
//     };

//     // Kirim notifikasi ke setiap subscription
//     for (const subscription of subscriptions) {
//       // Definisikan sub berdasarkan subscription yang diambil dari database
//       const sub = {
//         endpoint: subscription.endpoint,
//         keys: {
//           p256dh: subscription.p256dh,
//           auth: subscription.auth,
//         },
//       };

//       // Kirim push notification ke setiap subscriber
//       await sendPushNotification(sub, notificationData)
//         .then((response) => {
//           console.log("Notification sent successfully to:", sub.endpoint, response);
//         })
//         .catch((error) => {
//           console.error("Error sending notification to:", sub.endpoint, error);
//         });
//     }

//     res.status(200).json({ message: "Notifications sent to all subscribers." });
//   } catch (error) {
//     console.error("Error sending notifications:", error);
//     res.status(500).json({ error: "Failed to send notifications." });
//   }
// };
