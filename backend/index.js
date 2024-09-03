// File: backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
// import Units from "./models/UnitModel.js";
// import Users from "./models/UserModel.js";
// import Jadwals from "./models/JadwalModel.js";
// import PesertaRapat from "./models/PesertaModel.js";
// import Subscription from "./models/SubscriptionModel.js";
import AuthRoute from "./routes/AuthRoute.js";
import UnitRoute from "./routes/UnitRoute.js";
import UserRoute from "./routes/UserRoute.js";
import JadwalRoute from "./routes/JadwalRoute.js";
import NotificationRoutes from "./routes/NotificationRoutes.js";

dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log("Database Connected...");
  // untuk create table (matikan jika tabel sudah berhasil dibuat supaya tidak terus menerus diproses)
  //   await Units.sync();
  //   await Users.sync();
  //   await Jadwals.sync();
  //   await PesertaRapat.sync();
  //   await Subscription.sync();
} catch (error) {
  console.error(error);
}

app.use(express.static("public"));

// Mendapatkan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("__dirname:", __dirname);
console.log("Uploads path:", join(__dirname, "uploads"));

// Middleware untuk menangani unggahan file
app.use(fileUpload());

// Middleware untuk menyajikan file statis dari folder uploads
app.use("/uploads", express.static(join(__dirname, "uploads")));

// Middleware untuk menangani CORS
const corsOptions = {
  origin: "https://b51d-2001-448a-1123-159c-a4-49a4-1831-2ef7.ngrok-free.app",
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Handling request for ${req.url}`);
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://b51d-2001-448a-1123-159c-a4-49a4-1831-2ef7.ngrok-free.app"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log("Response Headers Set:", res.getHeaders());
  next();
});

// // middleware
// app.use(
//   cors({
//     origin:
//       //   "http://localhost:3000",
//       "https://b51d-2001-448a-1123-159c-a4-49a4-1831-2ef7.ngrok-free.app",
//     //domain frontend yang diizinkan untuk dapat mengakses API (backend)
//     credentials: true, //berfungsi untuk frontend dapat mengirimkan request beserta cookie dengan menyertakan credentialsnya
//   })
// );

// // Middleware untuk logging header response
// app.use((req, res, next) => {
//   console.log("Request URL:", req.originalUrl);
//   console.log("Response Headers:", res.getHeaders());
//   next();
// });

// // Middleware untuk menangani CORS
// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://b51d-2001-448a-1123-159c-a4-49a4-1831-2ef7.ngrok-free.app"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.use(express.json()); //untuk bisa menerima data dalam format json
app.use(AuthRoute);
app.use(UnitRoute);
app.use(UserRoute);
app.use(JadwalRoute);
app.use(NotificationRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server up and running on port di ${process.env.APP_PORT}`);
});
