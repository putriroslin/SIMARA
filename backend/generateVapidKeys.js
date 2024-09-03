// File: backend/generateVapidKeys.js

import webPush from "web-push";

// Generate VAPID keys
const vapidKeys = webPush.generateVAPIDKeys();

// Output the keys
console.log("Public Key:", vapidKeys.publicKey);
console.log("Private Key:", vapidKeys.privateKey);
