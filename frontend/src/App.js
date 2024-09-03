// File: frontend/src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import {
//   sendSubscriptionToServer,
//   urlBase64ToUint8Array,
// } from "./helpers/pushSubscriptionHelper";
// import { askNotificationPermission, subscribeUserToPush } from "./helpers/pushSubscriptionHelper";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import KelolaUser from "./pages/KelolaUser";
import AddUser from "./pages/AddUser";
import UpdateUser from "./pages/UpdateUser";
import Profile from "./pages/Profile";
import Undangan from "./pages/Undangan";
import AddJadwal from "./components/FormAddJadwal";
import UpdateJadwal from "./components/FormUpdateJadwal";
import TambahPeserta from "./components/Peserta";
// import TestParams from "./pages/TestParams";

const App = () => {
  const [userId, setUserId] = useState(null);

  const handleLoginSuccess = (id) => {
    setUserId(id);
  };

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }

  //   useEffect(() => {
  //     if ("serviceWorker" in navigator && "PushManager" in window) {
  //       navigator.serviceWorker.ready.then((registration) => {
  //         Notification.requestPermission().then((permission) => {
  //           if (permission === "granted") {
  //             registration.pushManager
  //               .subscribe({
  //                 userVisibleOnly: true,
  //                 applicationServerKey: urlBase64ToUint8Array(
  //                   "BBw5_BdZZdEPkyTgOCkesp6ON396ykLhsXaWen23irUHteieIH2de3gof1a3tSGUaVN6_zMQ-PubB8pmplic7Hk"
  //                 ),
  //               })
  //               .then((subscription) => {
  //                 console.log("Subscription successful:", subscription);
  //                 sendSubscriptionToServer(subscription);
  //               })
  //               .catch((error) => {
  //                 console.error("Failed to subscribe the user:", error);
  //               });
  //           }
  //         });
  //       });
  //     }
  //   }, []);

  // Ketika pengguna login berhasil, minta izin notifikasi dan subscribe push
  //   const handleLoginSuccess = (userId) => {
  // 	 // Setelah pengguna berhasil login, minta izin notifikasi
  //     askNotificationPermission()
  //       .then(() => {
  //         console.log("Notification permission granted.");
  //         // Setelah izin diberikan, subscribe user untuk push notifications
  //         subscribeUserToPush(userId);
  //       })
  //       .catch((error) => {
  //         console.error("Notification permission denied:", error);
  //       });
  //   };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home userId={userId} />} />
          <Route path="/profil" element={<Profile />} />

          <Route element={<Layout />}>
            <Route path="/kelola-operator" element={<KelolaUser />} />
            <Route path="/kelola-karyawan" element={<KelolaUser />} />
            <Route path="/add-operator" element={<AddUser />} />
            <Route path="/add-karyawan" element={<AddUser />} />
            <Route path="/update-operator/:id" element={<UpdateUser />} />
            <Route path="/update-karyawan/:id" element={<UpdateUser />} />

            <Route path="/add-jadwal" element={<AddJadwal />} />
            <Route path="/update-jadwal/:id" element={<UpdateJadwal />} />
            <Route path="/tambah-peserta" element={<TambahPeserta />} />

            <Route path="/undangan" element={<Undangan />} />

            {/* <Route path="/test-params/:id" element={<TestParams />} />  */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
