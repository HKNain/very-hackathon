import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signup = async (req, res) => {
  try {
    const {
      email, 
      password, 
      userName 
    } = req.body;
    

    if (
      password.trim().length < 6 ||  !emailRegex.test(email) || userName.trim().length < 6
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
      generateTokenAndSetCookie(newUser._id, res);

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

export const login = async (req, res) => {
  try {
    const {  password, userName  } = req.body;
    if (
      password.trim().length < 6 || userName.trim().length < 6
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

   

   

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success : "Successfully Login "
    });
  } catch (error) {
    console.log("Error in Login Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};