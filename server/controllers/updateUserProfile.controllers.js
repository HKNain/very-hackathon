import User from "../models/user.models.js";
import cloudinary from "../utils/Cloudinary.js";
import streamifier from "streamifier";
import sanitizeHtml from "sanitize-html"

export const updateUserProfile = async (req , res )=>{
    try {
        const id = req.user._id
        let {name} = req.body
        let updatedObj = {}
        if (name.length < 6 && name){
            return res.stats(400).json({inValidName : "Please enter coorect credentials  "})
        } else if (name.length >= 6 && name){
            updatedObj.userName = name
        }

        if (req.file) {
            const streamUpload = (fileBuffer) => {
                    return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "taskTracker" },
                        (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                        }
                    );
                    streamifier.createReadStream(fileBuffer).pipe(stream);
                    });
                };
    
            const result = await streamUpload(req.file.buffer);
            updatedObj.userImage =  result.secure_url
        }
        console.log (" UPDATED OBJECT ----- > ",updatedObj)
        const updatedProfile = await User.findByIdAndUpdate(
              id,
              { $set: updatedObj },
              { new: true }
        );
        console.log (updatedProfile)
        
        return res.status(200).json({success : " Profile has been updated "}) 


    } catch ( error ){
        console.log ( error )
        return res.status(500).json({error : " Internal server error "})
    }
}
