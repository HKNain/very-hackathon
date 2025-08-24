import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId },"2354566789", {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: false,
    sameSite: "Strict",
  });
};

export default generateTokenAndSetCookie;