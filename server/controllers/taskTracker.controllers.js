import usertaskTracker from "../models/usertaskTracker.models.js";
import User from "../models/user.models.js";


export const createTaskTracker = async  (req, res) => {
  try {
    const user = req.user;
    const {
      taskName,
      taskImage,
      taskDetails,
      taskDuration,
      taskType,
      isChallenger 
    } = req.body;
    if (
      !taskName ||
      !taskImage ||
      !taskDetails ||
      !taskDuration ||
      !taskType
    ) {
      return res.status(400).json("Please enter correct data");
    }
    let difficulty = "";
    if (taskDuration <7) {
      return res.status(400).json({error : "Duration cant be less than 7 "})
    }
    if ( taskDuration >=7 && taskDuration < 50){
      difficulty = 'easy'
    }else if (taskDuration >=50 && taskDuration <100){
      difficulty ='medium'
    }else if ( taskDuration >=100 && taskDuration <180){
      difficulty ='hard'
    }else {
      difficulty='superHard'
    }
   const today = new Date();

    const day = today.getDate();           
    const month = today.getMonth(); 
    const year = today.getFullYear();

    // * Function to check leap year
    function isLeapYear(y) {
      return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    }

    
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

   
    let totalDays = day;
    for (let i = 0; i < month; i++) {
      totalDays += daysInMonth[i];
    }

    



    const taskCreated = await usertaskTracker.create({
      userId : user._id, 
      taskName,
      taskImage,
      taskDetails,
      taskDuration,
      difficulty,
      taskType,
      createdAt : totalDays,
      isChallenger
    })
    return res.status(200).json({success : "task has been created "},
      taskCreated
    )


  } catch (error) {
    console.log("Error in createTaskTracker Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTaskTracker = async (req, res) => {
  try {
    const user = req.user;
    const userTracks = await usertaskTracker.find({ userId: user._id });
    const userDetails = await User.findById(user._id);

    const today = new Date();

    const day = today.getDate();           
    const month = today.getMonth(); 
    const year = today.getFullYear();

    
    function isLeapYear(y) {
      return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    }

    
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

   
    let trackDays = day;
    for (let i = 0; i < month; i++) {
      trackDays += daysInMonth[i];
    }

    

    const usefulTracksToShow = await Promise.all (userTracks.map(async (track) => {
        const createdAtDay = track.createdAt

        const totalDuration =  trackDays - createdAtDay;
        console.log ("Toatsl ",totalDuration)
        console.log ("",track.taskDuration)

        if (totalDuration >= track.taskDuration) {
          if (track.taskDuration <= track.streaks + track.extraDurationByPoints + track.extraDuration) {
            userDetails.taskHistory.push({
              taskDetails: track.taskDetails,
              taskName: track.taskName,
              taskType: track.taskType,
              taskDuration: track.taskDuration,
              difficulty: track.difficulty,
              challenger : `${track.isChallenger?"True" :"" }`
              
            });
            userDetails.Achievements.push(
              `${track.difficulty}crusher`,
              
              `${track.isChallenger? `${track.taskDuration} Lion Challenger`: `${track.taskDuration} Lion Streaker` }`
            
            )
            

            
            if (track.difficulty === "easy") {
              userDetails.points += 2;
            } else if (track.difficulty === "medium") {
              userDetails.points += 10;
            } else if (track.difficulty === "hard") {
              userDetails.points += 20;
            } else if (track.difficulty === "superHard") {
              userDetails.points += 40;
            }

            await usertaskTracker.findByIdAndDelete(track._id);
          } else {
            await usertaskTracker.findByIdAndDelete(track._id);
          }
        } else {
          console.log ( "TTT",track.streaks + track.extraDurationByPoints + track.extraDuration )
          console.log ( "EDHYGDF", track.taskDuration )
          if (track.taskDuration >= track.streaks + track.extraDurationByPoints + track.extraDuration) {
            console.log ( "Hello world")
            return {
              taskDetails: track.taskDetails,
              taskName: track.taskName,
              taskType: track.taskType,
              taskDuration: track.taskDuration,
              difficulty: track.difficulty,
              editedAt: track.editedAt,
            };
          } else {
            await usertaskTracker.findByIdAndDelete(track._id);
          }
        }
        await userTracks.save()
      })
   )
  

    if (usefulTracksToShow.length === 0) {
      return res.status(200).json({ message: "No task To show " });
    }
    console.log ( usefulTracksToShow)

    await userDetails.save();
    

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: usefulTracksToShow,
      
    });

  } catch (error) {
    console.log("Error in getTaskTracker Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
{ // !
    "success": "Task has been updated, refresh the page",
    "task": {
        "_id": "68b1a6c5b31b5ac0e091e5f6",
        "userId": "68b1a1be84f3ebd88f48c409",
        "taskName": "Daily Gym Challenger",
        "taskImage": "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg",
        "taskType": "gym",
        "taskDetails": "Gym is turning to boring ",
        "taskDuration": 50,
        "difficulty": "medium",
        "streaks": 2,
        "extraDuration": 2,
        "isExtraDurationCardCompleted": true,
        "extraDurationByPoints": 0,
        "isTaskCompleted": false,
        "createdAt": "241",
        "isChallenger": false,
        "editedAt": "2025-08-29T13:10:29.871Z",
        "updatedAt": "2025-08-29T13:24:28.977Z",
        "__v": 0
    }
}
//!

*/

export const updateTaskTracker = async (req, res) => {
  try {
    const {
      taskImage,
      id,
      taskDetails,
      isStreaksClicked,
      isExtraDurationClicked,
      isExtraDurationByPoints,
    } = req.body;

    const user = req.user;
    const userDetails = await User.findById(user._id);

    if (!id) {
      return res.status(400).json({ error: "No such task is there" });
    }

    const TaskTracker = await usertaskTracker.findById(id);

    if (!TaskTracker) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedObj = {};

    if (TaskTracker.streaks === 0) {
      for (const task in req.body) {
        if ( task!=="taskDetails"   && task  !== "isExtraDurationClicked" && task !=="isExtraDurationByPoints" && task !=="isStreaksClicked")
        updatedObj[task] = req.body[task];
      }
    } else {
      for (const task in req.body) {
        if ( task  !== "isExtraDurationClicked" && task !=="isExtraDurationByPoints" && task !=="isStreaksClicked") updatedObj[task] = req.body[task];
      }
    }
    console.log (isStreaksClicked)
    if (isStreaksClicked){
      let streaks = TaskTracker.streaks
      streaks+=1 
      console.log ( streaks )
      updatedObj.streaks = streaks 
    }
    console.log (updatedObj)

    let extraDuration = TaskTracker.extraDuration;
    let extraDurationByPoints = TaskTracker.extraDurationByPoints;

    if (isExtraDurationClicked) {
      if (user.difficulty === "easy" || TaskTracker.isExtraDurationCardCompleted) {
        return res.status(400).json({ error: "Exceeded overLimit of extraDuration" });
      } else {
        extraDuration += 1;
        updatedObj.extraDuration = extraDuration;
      }
    }

    if (isExtraDurationByPoints) {
      if (userDetails.totalCoins < 20) {
        return res.status(400).json({ error: "Not enough points" });
      } else {
        extraDurationByPoints += 1;
        updatedObj.extraDurationByPoints = extraDurationByPoints;

        userDetails.totalCoins -= 20;
        await userDetails.save();
      }
    }

    if (TaskTracker.difficulty === "medium") {
      if (extraDuration == 2) {
        updatedObj["isExtraDurationCardCompleted"] = true;
      }
    } else if (TaskTracker.difficulty === "hard") {
      if (extraDuration == 6) {
        updatedObj["isExtraDurationCardCompleted"] = true;
      }
    } else if (TaskTracker.difficulty === "superHard") {
      if (extraDuration == 12) {
        updatedObj["isExtraDurationCardCompleted"] = true;
      }
    }

    const updatedTask = await usertaskTracker.findByIdAndUpdate(
      id,
      { $set: updatedObj },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: "Task has been updated, refresh the page", task: updatedTask });
  } catch (error) {
    console.log("Error in updateTaskTracker Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





export const  deleteTaskTracker = async(req, res ) =>{
  try {
    const {id} = req.body ;
    const deletedtaskTracker = await usertaskTracker.findByIdAndDelete(id)
    

    return res.status(200).json({success : "task has been deleted successfully refresh the page "});

  }catch (error) {
    console.log("Error in deleteTaskTracker Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}