import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    req.id = decoded.id;
    req.name = decoded.name;
    req.email = decoded.email;
    req.role = decoded.role;
    req.unitId = decoded.unitId;
    req.status = decoded.status;
	req.alasanInactive = decoded.alasanInactive;
    req.profilePhoto = decoded.profilePhoto;
    next();
  });
};
