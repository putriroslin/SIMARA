import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Units from "./UnitModel.js";

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM("superadmin", "operator", "karyawan"),
      allowNull: false,
    },
    //menampung id unit dari tabel units
    unitId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for superadmin
      //utk menentukan unitId merujuk ke dalam id di tabel units
      references: {
        model: Units,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
      allowNull: false,
    },
    alasanInactive: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePhoto: {
      type: DataTypes.STRING, // Misalnya, menyimpan URL file foto profil
      allowNull: true, //diizinkan untuk kosong (NULL)
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

//Definisikan hubungan antara User dan Unit
//hubungan one-to-many, satu unit memiliki banyak user
Units.hasMany(Users, {
  foreignKey: "unitId", ///dari id tabel Units
  as: "user", //mengakses daftar pengguna yang terkait dengan unit tsb dengan unit.user
});
//setiap pengguna (Users) memiliki satu unit (Units) yang terkait
//Penggunaan as: 'unit' memungkinkan Anda untuk mengakses unit terkait menggunakan alias unit di operasi kueri
Users.belongsTo(Units, {
  foreignKey: "unitId", //setiap user terkait dengsan satu unit melalui kolom unitId
  as: "unit", //melihat unit dari pengguna tsb dengan user.unit
});

// await db.sync({ alter: true });

export default Users;
