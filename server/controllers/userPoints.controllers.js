

export const getUserPoints = async ( req , res )=> {
        const user = req.user 
        return res.status(200).json({userPoints : user.totalCoins})
}