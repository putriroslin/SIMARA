import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import PesertaRapat from "./PesertaModel.js";

const { DataTypes } = Sequelize;

const Jadwals = db.define(
  "jadwals",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tema: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggalRapat: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    waktuMulai: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    waktuSelesai: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Belum Dimulai", // Set default value
      allowNull: false,
    },
    jenisRapat: {
      type: DataTypes.ENUM("offline", "online"),
      allowNull: false,
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileRapat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

// Association with User (Participants)
// many-to-many karena satu rapat dapat diikuti oleh banyak pengguna, dan satu pengguna bisa mengikuti banyak rapat
Jadwals.belongsToMany(Users, {
  through: PesertaRapat, // Nama tabel penghubung untuk many-to-many
  as: "peserta", //alias untuk relasi ini. ketika mengakses jadwal rapat,  bisa mendapatkan daftar pesertanya melalui jadwal.peserta
  foreignKey: "jadwalId",
  otherKey: "userId",
});

Users.belongsToMany(Jadwals, {
  through: PesertaRapat,
  as: "jadwal", //alias untuk relasi ini. ketika mengakses pengguna, bisa mendapatkan daftar jadwal rapat yang diikutinya melalui user.jadwal
  foreignKey: "userId",
  otherKey: "jadwalId",
});

// await db.sync({ alter: true });

export default Jadwals;
