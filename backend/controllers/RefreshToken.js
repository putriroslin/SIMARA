import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body; // Mengambil refresh token dari body permintaan

    if (!refreshToken) return res.sendStatus(401);

    const user = await Users.findOne({
      where: { refreshToken },
    });

    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        unitId: user.unitId,
		status: user.status,
		alasanInactive: user.alasanInactive,
		profilePhoto: user.profilePhoto,
      };

      const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" });
  }
};
