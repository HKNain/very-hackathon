import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors"

import connectToDatabase from "./database/connectToDatabase.js";
import authRoutes from "./routes/auth.route.js"
import dashBoardRoutes from "./routes/dashBoard.route.js"


const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

app.use("/api/auth", authRoutes);
app.use("/dashboard", dashBoardRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectToDatabase();
});