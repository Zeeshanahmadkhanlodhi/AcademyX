import { NextFunction , Request,Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (err:any ,req:Request, res:Response,next:NextFunction) => {
    err.status = err.status || 500;
    err.message = err.message || 'Internal Server Error';

    // wrong mongodb id error  
    if(err.name === 'CastError' && err.kind === 'ObjectId'){
        return next(new ErrorHandler('Resource not found',404));
    }

    // duplicate key error
    if(err.code === 11000){
        const message = Object.values(err.keyValue)[0];
        return next(new ErrorHandler(message,400));
    }

    // wrong jwt id error
    if(err.name === 'JsonWebTokenError'){
        return next(new ErrorHandler('Not Authorized',401));
    }

    // jwt expired error
    if(err.name === 'TokenExpiredError'){
        return next(new ErrorHandler('Token Expired',401));
    }

    res.status(err.statusCode).json({
        success:false,
        error:err.message,
       
    });
}
