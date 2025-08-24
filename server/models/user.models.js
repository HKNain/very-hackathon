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

});

const User = mongoose.model("User", userSchema);

export default User;