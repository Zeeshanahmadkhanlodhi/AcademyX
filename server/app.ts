require('dotenv').config();
import express, { NextFunction , Request , Response } from "express";
export const app  = express(); 
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";


//body parser
app.use(express.json({limit:"50mb"}));


//cookie parser
app.use(cookieParser());

//cors
app.use(cors({
    origin:process.env.ORIGIN
}));

// Testing api

app.get("/test",(req:Request,res:Response,next:NextFunction) => {
    res.status(200).json({
        succcess:true,
        message:"Api is working",
    });
});

app.all("*",(req:Request,res:Response,next:NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} Not Found`) as any;
    err.status = 404;
    next(err);
});

app.use(ErrorMiddleware);
