import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import tokenStoredToBeBlackListed from "../models/token.models.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - no token" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
        return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
    const tokenId = decoded.tokenId ;
    console.log ( tokenId )

   const isBlackListedToken = await tokenStoredToBeBlackListed.findOne({
        SchemaId: tokenId
    });

    if (isBlackListedToken){
        return res.status(401).json({error : "Unauthorized - Invalid token Please Login ." })
    }


    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectroute", error.message);
    res.status(500).json({ error: "Inernal Server Error" });
  }
};

export default protectRoute;