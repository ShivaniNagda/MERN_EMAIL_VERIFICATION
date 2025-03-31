
import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import authRoutes from  "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";



const app = express();
const _dirname = path.resolve();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth",authRoutes);


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,"/frontendClient/dist")));
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(_dirname,"frontendClient","dist","index.html"));
    })
}

 export default app;