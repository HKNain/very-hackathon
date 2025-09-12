import express from "express";
import protectRoute from "../middleware/protectRoute.middleware.js";
import { createTaskTracker, getTaskTracker ,deleteTaskTracker, updateTaskTracker } from "../controllers/taskTracker.controllers.js";
import { isRegularlyUserComing, showRegularComingStreak } from "../controllers/userComingToWebsiteReg.controllers.js";
import { getAchievements } from "../controllers/userAchievements.controllers.js";
import { getUserProfile } from "../controllers/auth.controllers.js";
import {upload} from "../utils/multer.js";
import { getUserPoints } from "../controllers/userPoints.controllers.js";
// import { getNotifications } from "../controllers/userNotification.controllers.js";

const router = express.Router()


router.post("/createtask",protectRoute,upload.single("taskImage"),createTaskTracker)
router.get("/gettasks", protectRoute,isRegularlyUserComing,getTaskTracker)
router.delete('/deletetask',protectRoute,deleteTaskTracker)
router.patch('/updatetask',protectRoute,upload.single("taskImage"),updateTaskTracker)




router.get ('/achievements',protectRoute , getAchievements )
router.get('/streak', protectRoute , showRegularComingStreak)
router.get('/',protectRoute)
router.get('/profile',protectRoute,getUserProfile)
router.get('/totalpoints', protectRoute , getUserPoints  )



// router.get('/notification',protectRoute , getNotifications )

export default router