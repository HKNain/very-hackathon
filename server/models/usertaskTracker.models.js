import mongoose, { Schema } from "mongoose";
// import { v4 as uuidv4 } from 'uuid';
// const uniqueTaskId = uuidv4()

const usertaskTrackerSchema = new Schema(
  {
    userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    taskImage: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    taskDetails: {
      type: String,
      required: true,
    },
    taskDuration: {
      type: Number, 
      required: true,
      //  TODO Add min here
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard", "superHard"],
    },
    streaks: {
      type: Number,
      default: 0,
    },
    editedAt: {
      type: Date,
      default: Date.now,
    },
    extraDuration: {
      type: Number,
      default: 0,
    },
    isExtraDurationCardCompleted : {
      type : Boolean ,
      default : false ,
    }, 
    extraDurationByPoints : {
      type : Number ,
      default : 0
    },
   
    isTaskCompleted : {
        type : Boolean,
        default : false ,
    },
    createdAt : {
      type : String  ,
      default : 0
    },
    isChallenger : {
      type : Boolean ,
      default : false 
    }

    
   
  },
  { timestamps: true }
);

const UserTaskTracker = mongoose.model("UserTaskTracker", usertaskTrackerSchema);

export default UserTaskTracker;
