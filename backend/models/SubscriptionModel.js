// File: backend/models/SubsciptionModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Subscription = db.define("subscription", {
  // URL unik yang menjadi endpoint untuk push notifications
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Setiap subscription memiliki endpoint yang unik
  },
  // Waktu kadaluwarsa untuk subscription
  expirationTime: {
    type: DataTypes.DATE,
    allowNull: true, // expirationTime bisa null
  },
  // Kunci enkripsi yang digunakan untuk mengamankan notifikasi push
  p256dh: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Kunci enkripsi yang digunakan untuk mengamankan notifikasi push
  auth: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    // Menambahkan kolom userId
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Users, // Nama tabel users
      key: "id",
    },
  },
});

// Definisikan relasi: User memiliki banyak Subscription
//hubungan one-to-many, satu user memiliki banyak subscription
Users.hasMany(Subscription, {
  foreignKey: "userId",
  //   onDelete: "CASCADE", // Jika user dihapus, hapus juga subscription terkait
});

// Relasi Subscription dimiliki oleh User
Subscription.belongsTo(Users, {
  foreignKey: "userId",
});

// await db.sync({ alter: true });

export default Subscription;
