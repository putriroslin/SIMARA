// File: frontend/src/helpers/pushSubscriptionHelper.js
import axios from "axios";

// Minta izin notifikasi dari pengguna
export function askNotificationPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission();
    permissionResult.then((permission) => {
      console.log("Notification permission status:", permission);
      if (permission === "granted") {
        resolve(true);
      } else {
        reject(new Error("Permission not granted for Notification"));
      }
    });
  });
}
// export function askNotificationPermission() {
//   return new Promise((resolve, reject) => {
//     const permissionResult = Notification.requestPermission((result) => {
//       resolve(result);
//     });

//     if (permissionResult && permissionResult.then) {
//       permissionResult.then(resolve, reject);
//     }
//   });
// }

// Minta izin notifikasi dari pengguna
// export function askNotificationPermission() {
//   return Notification.requestPermission();
// }

export function subscribeUserToPush(userId) {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log("Service Worker is ready for PushManager.");
      // Periksa apakah subscription sudah ada
      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          // Jika subscription ada, kirim ke server untuk diperbarui
          console.log(
            "Existing subscription found, updating on server:",
            subscription
          );
          // Kirim subscription yang sudah ada ke server
          sendSubscriptionToServer(subscription, userId);
        } else {
          // Jika tidak ada subscription, buat yang baru
          const applicationServerKey = urlBase64ToUint8Array(
            "BBw5_BdZZdEPkyTgOCkesp6ON396ykLhsXaWen23irUHteieIH2de3gof1a3tSGUaVN6_zMQ-PubB8pmplic7Hk"
          );
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey,
            })
            .then((subscription) => {
              console.log("New subscription created:", subscription);
              // Kirim subscription baru ke server
              sendSubscriptionToServer(subscription, userId);
            })
            .catch((error) => {
              console.error("Failed to subscribe the user:", error);
            });
        }
      });
    });
  } else {
    console.error("Service Worker or PushManager is not supported.");
  }
}

// Subscribe pengguna ke push notification dan kirim ke server
// export function subscribeUserToPush(userId) {
//   if ("serviceWorker" in navigator && "PushManager" in window) {
//     navigator.serviceWorker.ready.then((registration) => {
//       const applicationServerKey = urlBase64ToUint8Array(
//         "BBw5_BdZZdEPkyTgOCkesp6ON396ykLhsXaWen23irUHteieIH2de3gof1a3tSGUaVN6_zMQ-PubB8pmplic7Hk"
//       );
//       registration.pushManager
//         .subscribe({
//           userVisibleOnly: true,
//           applicationServerKey: applicationServerKey,
//         })
//         .then((subscription) => {
//           // Kirim subscription dan userId ke server
//           console.log("Subscription successful:", subscription);
//           sendSubscriptionToServer(subscription, userId);
//         })
//         .catch((error) => {
//           console.error("Failed to subscribe the user:", error);
//         });
//     });
//   }
// }

// Kirim subscription ke server
export function sendSubscriptionToServer(subscription, userId) {
  console.log("Sending subscription to server:", subscription);

  axios
    .post(`${process.env.REACT_APP_API_URL}/api/subscribe`, {
      subscription,
      userId,
    })
    .then((response) => {
      console.log("Subscription saved successfully:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error saving subscription:",
        error.response?.data || error.message
      );
    });
}

// export function sendSubscriptionToServer(subscription) {
//   return fetch(`${process.env.REACT_APP_API_URL}/api/subscribe`, {
//     method: "POST",
//     body: JSON.stringify(subscription),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       console.log("Raw response:", response);
//       if (!response.ok) {
//         return response.text().then((text) => {
//           throw new Error(
//             `HTTP error! Status: ${response.status}, Response: ${text}`
//           );
//         });
//       }
//       return response.json(); // Correctly parse the response as JSON
//     })
//     .then((data) => console.log("Response from server:", data))
//     .catch((error) => console.error("Error sending subscription:", error));
// }

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+") // Mengganti '-' dengan '+'
    .replace(/_/g, "/"); // Mengganti '_' dengan '/'

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
