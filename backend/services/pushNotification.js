// File: backend/services/pushNotification.js
import webpush from "web-push";
import Subscription from "../models/SubscriptionModel.js";

// Generate atau gunakan VAPID keys yang sudah kamu buat
const vapidKeys = {
  publicKey:
    "BBw5_BdZZdEPkyTgOCkesp6ON396ykLhsXaWen23irUHteieIH2de3gof1a3tSGUaVN6_zMQ-PubB8pmplic7Hk",
  privateKey: "BS8LFF_XeJ8IwoJalNCeNqW0O2hR4FqyIifJkmXhM4s",
};

// Konfigurasi VAPID details
webpush.setVapidDetails(
  "mailto:putriroslin1@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export const sendPushNotification = async (subscription, dataToSend) => {
	try {
	  console.log("Sending push notification to:", subscription.endpoint);
  
	  await webpush.sendNotification(subscription, JSON.stringify(dataToSend));
  
	  console.log("Push notification sent successfully:", subscription.endpoint);
	} catch (error) {
	  console.error("Error sending push notification:", error);
  
	  if (error.statusCode === 410) { // 410: Subscription expired or unsubscribed
		console.log("Subscription has expired or unsubscribed. Deleting subscription from database.");
		await Subscription.destroy({ where: { endpoint: subscription.endpoint } });
	  }
	}
  };

// Fungsi untuk mengirim push notifications
// export const sendPushNotification = (subscription, dataToSend) => {
//   console.log("Subscription received:", subscription);
//   console.log("Sending push notification to:", subscription.endpoint);

//   //   const sub = {
//   //     endpoint: subscription.endpoint,
//   //     keys: {
//   //       p256dh: subscription.p256dh,
//   //       auth: subscription.auth,
//   //     },
//   //   };

//   //   console.log("Sending push notification to:", sub.endpoint);

//   //   return webpush
//   //     .sendNotification(sub, JSON.stringify(dataToSend))
//   //     .then((response) => {
//   //       console.log("Push notification sent successfully:", response);
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error sending push notification:", error);
//   //     });

//   return webpush
//     .sendNotification(subscription, JSON.stringify(dataToSend))
//     .then((response) => {
//       console.log(
//         "Push notification sent successfully:",
//         subscription.endpoint
//       );
//       return response; // Return the response, if needed
//     })
//     .catch((error) => {
//       console.error("Error sending push notification:", error);
//     });
// };
