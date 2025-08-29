import User from "../models/user.models.js"
import jwt from "jsonwebtoken"
import { generateTokenAndSetCookieForComingToWebsite } from "../utils/userComingRegularlyToken.js"



const achievementForDaysCome= (days)=> {
    if ( days < 50){
        return null
    }

    for ( let i =1 ; i <= 10 ; i++){
        if (( days % (50*i) == 1 ) && ( days/(50*i) == 0 ) ){
            return `${50*i} day Boggler`
        }
    }
    return null 


}


export const isRegularlyUserComing = async (req, res, next) => {
  try {
    const token = req.cookies?.isRegularlyComing;
    const userDetails = await User.findById(req.user._id);

   
    let regularDaysUserCome = userDetails.regularlyComingToWebsiteDays;

    if (!token) {
      generateTokenAndSetCookieForComingToWebsite( req.user._id , res); // ❌ missing res
      regularDaysUserCome = 0;
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        regularDaysUserCome = 0;
      } else {
        const prevDate = new Date(decoded.prevDate);
        const now = new Date();

       
        const diffDays = Math.floor(
          (now.setHours(0, 0, 0, 0) - prevDate.setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          regularDaysUserCome += 1;

          const daysComeAchievemnets = achievementForDaysCome(regularDaysUserCome);
          if (daysComeAchievemnets != null) {
            userDetails.Achievements.push(daysComeAchievemnets);
          }

          generateTokenAndSetCookieForComingToWebsite( req.user._id , res); 
        } else if (diffDays > 1) {
          regularDaysUserCome = 0;
          generateTokenAndSetCookieForComingToWebsite(req.user._id , res); 
        }
      }
    }

   
    userDetails.regularlyComingToWebsiteDays = regularDaysUserCome;
    await userDetails.save();

    next();
  } catch (error) {
    console.log("error in isRegularlyUserComing", error);
    return res.status(500).json({ error: "Internal Serevr errror " });
  }
};

export const showRegularComingStreak =async (req, res) =>{
    try {
        const user = req.user 
        
        return res.status(200).json({success: "Get RegularComingStreak"},
            user.regularlyComingToWebsiteDays
        )
        
    } catch (error) {
        console.log ("error in showRegularComingStreak" , error )
        return res.status(500).json({error : "Internal Serevr errror "})
    }
}