import jwt from "jsonwebtoken";



export const generateTokenAndSetCookieForComingToWebsite = (userId, res) => {
    let now = new Date();

    const prevDate = now.getDate ()
    // Todo convert Date to days 

  const token = jwt.sign({ userId , prevDate}, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.cookie("isRegularlyComing", token, {
    maxAge:2* 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: false,
    sameSite: "Strict",
  });
};

