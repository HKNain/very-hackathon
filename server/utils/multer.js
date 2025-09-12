import multer from "multer";

// store files in memory before uploading
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
