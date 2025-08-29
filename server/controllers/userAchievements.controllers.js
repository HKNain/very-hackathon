import User from "../models/user.models.js";


export const getAchievements =async (req,res) =>{
    try {
        const user = req.user 
        
        const userAchievements = user.Achievements.map((achievement)=>{
            return achievement
        })
        const userHistoryTask = user.taskHistory.map((taskHistory)=>{
            return taskHistory
        })
        console.log (userAchievements, userHistoryTask)

        return res.status(200).json({success: " getAchievemts "},
            userHistoryTask,
            userAchievements
        )

        
    } catch (error) {
        console.log ( "error in getAchievements " , error )
        return res.status(500).json ( { error : "Internal Server Error "})
    }
}