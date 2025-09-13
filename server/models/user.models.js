import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type : String ,
        required : true ,
        unique : true ,
        minlength:6,
    },
    email: {
        type: String,
        required: true,
        unique : true ,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },

    password: {
        type: String,
        required: true,
        unique : true,
        minlength: 6,
    },  
    totalCoins : {
        type : Number ,
        default :0
    }, 
    regularlyComingToWebsiteDays : {
      
        type : Number ,
        default : 0

    },
    userImage : {
        type : String ,
        default : "https://res.cloudinary.com/def85u7nw/image/upload/v1757780037/taskTracker/dfgythnyqaciv4q9yyze.jpg"
    },
    taskHistory  : {
        type : Array , 
        default : []
    } , 
    Achievements : {
        type : Array ,
        default : []
    }

});

const User = mongoose.model("User", userSchema);

export default User;