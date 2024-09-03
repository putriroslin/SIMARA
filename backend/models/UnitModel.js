import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Units = db.define(
  "units",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nameUnit: {
      type: DataTypes.STRING,
      allowNull: false, //tidak diizinkan untuk kosong (NULL)
      //   unique: true, //nilai dalam kolom harus unik di seluruh tabel
      //untuk menentukan aturan validasi tambahan
      validate: {
        notEmpty: true, //nilai tidak boleh kosong atau hanya spasi
      },
    },
  },
  {
    freezeTableName: true, // Menggunakan nama tabel tanpa memodifikasi
    timestamps: true, // Menambahkan createdAt dan updatedAt secara otomatis
  }
);

// await db.sync({ alter: true });

export default Units;
