import jwt from "jsonwebtoken";

export const generateTokenAndSetCookieForComingToWebsite = (userId, res) => {
  const now = new Date();

  const startOfYear = new Date(now.getFullYear(), 0, 0); // Jan 0 = last day of previous year
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor(diff / oneDay);

  const token = jwt.sign({ userId, totalDays }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.cookie("isRegularlyComing", token, {
    maxAge: 2 * 24 * 60 * 60 * 1000, 
    httpOnly: false,  
    secure: false,   
    sameSite: "Strict",
  });
};
