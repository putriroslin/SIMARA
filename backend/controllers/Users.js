import Users from "../models/UserModel.js";
import Units from "../models/UnitModel.js";
import argon2 from "argon2";
import path from "path"; //Modul path menyediakan utilitas untuk menangani dan mengubah path file dan direktori.
import fs from "fs"; //Modul fs (File System) menyediakan API untuk berinteraksi dengan sistem file di Node.js.
import { fileURLToPath } from "url";

//mendapatkan daftar pengguna
export const getUsers = async (req, res) => {
  try {
    const { role, unitId } = req;

    let users;
    //jika login sebagai superadmin maka mendapatkan semua pengguna dengan role operator
    if (role === "superadmin") {
      users = await Users.findAll({
        where: {
          role: "operator",
        },
        include: [
          {
            model: Units,
            as: "unit",
            attributes: ["nameUnit"],
          },
        ],
      });
      //jika login sebagai operator maka mendapatkan pengguna dengan role karyawan pada unit yang sama
    } else if (role === "operator") {
      users = await Users.findAll({
        where: {
          unitId,
          role: "karyawan",
        },
        include: [
          {
            model: Units,
            as: "unit",
            attributes: ["nameUnit"],
          },
        ],
      });
    } else {
      return res.status(403).json({ msg: "Akses ditolak" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//mendapatkan pengguna berdasarkan id seperti utk di halaman profil
export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ["id", "name", "email", "role", "status", "alasanInactive", "profilePhoto"],
      include: [
        {
          model: Units,
          as: "unit", // Menggunakan alias
          attributes: ["nameUnit"],
        },
      ],
      //utk mencari pengguna berdasarkan id yang diberikan melalui parameter id dari permintaan (req.params.id)
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//membuat pengguna baru
export const createUser = async (req, res) => {
  const { name, email, password, status } = req.body;
  const role =
    req.body.role || (req.role === "superadmin" ? "operator" : "karyawan");
  // Debug logging (proses merekam pesan atau informasi dalam aplikasi utk tujuan debugging, pemantauan, dan analisis)
  //   console.log(`Creating user with unitId: ${unit}`);

  console.log("Data yang diterima di createUser:", req.body); // Logging data yang diterima
  const hashPassword = await argon2.hash(password);

  try {
    // Memastikan unit dengan nama yang diberikan ada di tabel units
    let unitId = null;
    if (role === "operator" && req.role === "superadmin") {
      if (!req.body.unit) {
        return res.status(400).json({ msg: "Unit harus diisi untuk operator" });
      }
      const unitRecord = await Units.findOne({
        where: { nameUnit: req.body.unit },
      });
      if (!unitRecord) {
        return res.status(400).json({ msg: "Unit tidak ditemukan" });
      }
      unitId = unitRecord.id;
    }

    // Jika operator membuat karyawan
    if (role === "karyawan" && req.role === "operator") {
      unitId = req.unitId;
    }
    await Users.create({
      name,
      email,
      password: hashPassword,
      role,
      unitId, // Bisa null jika unit tidak diberikan
      status,
    });
    res.status(201).json({ msg: "Pengguna Baru Berhasil Ditambahkan" });
  } catch (error) {
    console.error(`Error creating user:`, error);
    res.status(400).json({ msg: error.message });
  }
};

// memperbarui data pengguna
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    password,
    role,
    unit,
    status,
    alasanInactive,
    profilePhoto,
  } = req.body;

  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password ? await argon2.hash(password) : user.password;
    user.role = role || user.role;
    user.status = status || user.status;
	user.alasanInactive = alasanInactive || user.alasanInactive;
    user.profilePhoto = profilePhoto || user.profilePhoto;

    if (unit) {
      const foundUnit = await Units.findOne({ where: { nameUnit: unit } }); //kolom nameUnit pada tabel unit
      if (foundUnit) {
        user.unitId = foundUnit.id; // Update dengan unitId
      } else {
        return res.status(400).json({ message: "Unit not found" });
      }
    }

    // Memperbarui alasanInactive jika status menjadi 'inactive'
    if (status === "inactive") {
      user.alasanInactive = alasanInactive || user.alasanInactive; // Update alasanInactive
    } else {
      user.alasanInactive = null; // Hapus alasan jika status tidak 'inactive'
    }

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//menghapus pengguna
export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) return res.status(404).json({ msg: "Pengguna tidak ditemukan" });

  //jika semua validasi berhasil
  try {
    await Users.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "Pengguna Berhasil Dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

//mendapatkan status
export const getStatuses = async (req, res) => {
  try {
    // Ambil semua nilai enum status dari model Users
    const statuses = Users.rawAttributes.status.values;
    res.json(statuses);
  } catch (error) {
    console.error("Error in :", error); // Tambahkan logging kesalahan
    res.status(500).json({ message: error.message });
  }
};

//mengubah photo profile
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploads = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received ID:", id);

    if (!id) {
      return res.status(400).send("User ID is required");
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded.");
      return res.status(400).send("No files were uploaded.");
    }

    const file = req.files.profilePhoto;
    console.log("Received file:", file.name);

    const uploadDir = path.join(__dirname, "..", "uploads");
    const uploadPath = path.join(uploadDir, `${id}_${file.name}`);

    console.log("Upload Path:", uploadPath);

    // Ensure the uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    file.mv(uploadPath, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).send(err);
      }

      const profilePhotoUrl = `/uploads/${id}_${file.name}`;
      console.log("Profile photo URL:", profilePhotoUrl);
      await Users.update({ profilePhoto: profilePhotoUrl }, { where: { id } });

      res.json({ profilePhotoUrl });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

//menggnati password
export const changePassword = async (req, res) => {
  //   const { id } = req.params;
  const { oldPassword, newPassword } = req.body; // Mengambil data dari request body
  //   console.log("User ID:", id); // Tambahkan logging untuk melihat apakah userId sudah benar
  console.log("Request Body:", req.body); // Tambahkan logging untuk melihat data request body
  console.log("User ID from token:", req.id); // Log ID yang diambil dari token

  try {
    const user = await Users.findByPk(req.id); // Mengambil user dari database berdasarkan ID yang ada di token

    if (!user) {
      console.error("User not found for ID:", req.id); // Log jika user tidak ditemukan
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }
    // Verifikasi password lama dengan menggunakan argon2.verify
    const match = await argon2.verify(user.password, oldPassword);
    if (!match) {
      console.error("Password mismatch for user ID:", req.id); // Log jika password lama tidak cocok
      return res.status(400).json({ msg: "Password lama salah" });
    }
    const hashedNewPassword = await argon2.hash(newPassword, 10); // Mengenkripsi password baru, cost factor 10 adalah nilai default yang sering digunakan dan merupakan nilai yang seimbang antara keamanan dan kinerja untuk banyak aplikasi
    user.password = hashedNewPassword; // Menyimpan password baru yang telah dienkripsi ke dalam model user (menggantikan password lama)
    await user.save(); // Menyimpan perubahan ke database

    res.json({ msg: "Password berhasil diubah" }); // Mengirim respon sukses
  } catch (error) {
    console.error("Error in changePassword:", error); // Tambahkan logging kesalahan
    res.status(500).json({ msg: "Server error" }); // Mengirim respon error jika ada kesalahan
  }
};
