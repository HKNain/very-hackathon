import jwt from "jsonwebtoken";



export const generateTokenAndSetCookie = (userId, res,tokenId) => {
  const token = jwt.sign({ userId , tokenId}, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: false,
    sameSite: "Strict",
  });
};

