import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import {generateTokenAndSetCookie} from "../utils/jwtToken.js";
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import { v4 as uuidv4 } from 'uuid';
import blackListedToken from "./blacklistToken.controllers.js";

// * To generate unique Ids 
const tokenId  = uuidv4();


//  * To create acc
export const signup = async (req, res) => {
  try {
    let {
      email, 
      password, 
      userName 
    } = req.body;
    
    userName = userName.trim()
    if (
      password.trim().length < 6 ||  !emailRegex.test(email) || userName.length < 6
    ) {
      return res
        .status(400)
        .json({ error: "Please Enter exact Credentials "
        });
    }
    
    const user = await User.findOne({ email });
    
  
    if (user) {
      return res
      .status(400)
      .json({ error: "email already exists" });
    }

    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
   
    const newUser = new User({
      email,
      password: hashedPassword,
      userName,
    });
    
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res, tokenId);

      await newUser.save();

      res.status(201).json({
        success: "Successfully Created Account "
      });
    } else {
      res
      .status(400)
      .json({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in SignUp Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  * To create login


export const login = async (req, res) => {
  try {
    let {  password, userName   } = req.body;
     userName = userName.trim() 
    if (
      password.trim().length < 6 || userName.length < 6
    ) {
      return res
        .status(400)
        .json({ error: {
            password : email.password,
            userName : email.userName
           
        } });
    }

    const user = await User.findOne({ userName });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res
      .status(400)
      .json({ error: "Invalid Credentials" });
    }

    generateTokenAndSetCookie(user._id, res, tokenId);

    res.status(200).json({
      success : "Successfully Login "
    });
  } catch (error) {
    console.log("Error in Login Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  * To create logout 
// * Blacklisted Tokens are like before loggin out just store those token 


export const logout = async (req, res) => {
  try {
    await blackListedToken(tokenId)
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  * To create deleteAcc  
// * Blacklisted Tokens are like before delete out just store those token 

export const userAccountDelete = async (req, res ) =>{
  try {
    const user = req.user;
    await blackListedToken(tokenId) ; 
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
    await User.findByIdAndDelete(user._id);
    res.status(200).json({ message: "account deleted  Successfully" });
  } catch (error) {
    console.log("Error in userAccountDelete Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getUserProfile = ( req , res ) => {
  try {
    const user = req.user 
    const Achievements = user.Achievements || "No such Achievements yet ! "
    const regularlyComingToWebsiteDays = user.regularlyComingToWebsiteDays 
    const totalCoins = user.totalCoins
    const userName = user.userName 

  res.status(200).json({Achievements,regularlyComingToWebsiteDays,totalCoins,userName});
  } catch (error) {
    console.log("Error in getUserProfile Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}