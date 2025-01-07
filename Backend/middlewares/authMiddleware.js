import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.js";


//authentication middleware
const authenticate = asyncHandler(async(req, res, next)  => {
     //verify the variable for token
     let token;

     //read the token from cookie
     token = req.cookies.jwt;

     //if token is exited
     if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({
                success : false,
                message : 'Not authorized, token fail...!',
            });
        }
     }else{
        //token is not exited
        return res.status(400).json({
            success : false,
            message : 'Not authorized, token not found...!'
        })
     }
});


//admin authorization middleware
const  authorizedAdmin = asyncHandler(async(req, res, next) => {
    //if req.user  and req.user is isAdmin : true,
    if (req.user && req.user.isAdmin) {
        next();
    }else{
        //if not 
        return res.status(401).json({
            success : false,
            message : 'Not authorized as a admin...!'
        });
    }
});

export { authenticate, authorizedAdmin };