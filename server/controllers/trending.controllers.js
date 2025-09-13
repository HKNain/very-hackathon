import UserTaskTracker from "../models/usertaskTracker.models.js";


export const trendingTasks = async ( req , res ) => {
    try {
       const tracks = await UserTaskTracker.find();
        const totalTracks = tracks.length;
        let mostPrefferedChallengerTracks ;

        let arr = Array(4).fill(0);  
        let totalDuration = 0;
        let isTotalDurationTrackerlength = 0 

        for (let i = 0; i < totalTracks; i++) {
            const t = tracks[i];

            if (t.isChallenger) {
                if (t.taskDuration === 7) arr[0]++;
                else if (t.taskDuration === 50) arr[1]++;
                else if (t.taskDuration === 100) arr[2]++;
                else arr[3]++;
            } else {
                totalDuration += t.taskDuration;
                isTotalDurationTrackerlength ++ ;
            }
        }

        let mostPrefferedTracks = totalTracks > 0 ? Number(totalDuration / isTotalDurationTrackerlength) : 0;

        let index = 0, ans = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > ans) {
                ans = arr[i];
                index = i;
            }
        }

        return res.status(200).json({mostPrefferedChallengerTracks , mostPrefferedTracks , index})
    } catch (error) {
    console.log("Error in trending task  Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}