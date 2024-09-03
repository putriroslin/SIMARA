import Users from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  try {
    // Mencari user berdasarkan email
    const user = await Users.findOne({
      where: { email: req.body.email },
    });
    // Jika user tidak ditemukan
    if (!user) return res.status(404).json({ msg: "Email tidak ditemukan" });

    // Memeriksa password menggunakan Argon2
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Password salah" });

    // Periksa status pengguna
    if (user.status === "inactive") {
      return res.status(403).json({ msg: "Akun Pengguna Tidak Aktif" });
    }

    // Menyiapkan payload untuk token
    const { id, name, email, role, unitId, status, profilePhoto } = user;
    console.log(
      `User ditemukan: ${id}, ${name}, ${email}, ${role}, ${unitId}, ${status}, ${profilePhoto}`
    );

    //membuat (encode) jwt
    const payload = { id, name, email, role, unitId, status, profilePhoto };
    console.log("Payload untuk access token:", payload);

    //jwt.sign adalah dungsi dari jwt untuk membuat token
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    //solusi masalah role undifined
    // var test = jwt.decode(accessToken);
    // console.log("ini test aja", test);

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Menyimpan refresh token di database
    await Users.update(
      { refreshToken },
      {
        where: { id },
      }
    );

    // Kirimkan accessToken dan refreshToken ke client
    res
      .status(200)
      .json({
        accessToken,
        refreshToken,
        id,
        name,
        email,
        role,
        unitId,
        status,
        profilePhoto,
      });
  } catch (error) {
    console.error(error); // Menambahkan log untuk debugging
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const Me = async (req, res) => {
  try {
    // Mengambil token dari header Authorization
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // Jika token tidak ada
    if (!token) {
      return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    // Verifikasi token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ msg: "Token tidak valid" });
      }

      // Temukan pengguna berdasarkan ID dari token
      const user = await Users.findOne({
        attributes: [
          "id",
          "name",
          "email",
          "role",
          "unitId",
          "status",
          "profilePhoto",
        ],
        where: {
          id: decoded.id,
        },
      });

      // Jika pengguna tidak ditemukan
      if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }

      // Kirim data pengguna sebagai respons
      res.status(200).json(user);
    });
  } catch (error) {
    console.error(error); // Menambahkan log untuk debugging
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};

export const Logout = async (req, res) => {
  try {
    const { refreshToken } = req.body; // Mengambil refresh token dari body permintaan

    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findOne({ where: { refreshToken } });

    if (!user) return res.sendStatus(204);

    await Users.update({ refreshToken: null }, { where: { id } });

    res.status(200).json({ msg: "Anda Telah Logout" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
