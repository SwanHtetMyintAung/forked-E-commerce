import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.js";


//authentication middleware
const authenticate = asyncHandler(async(req, res, next)  => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // Extract token
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password"); // Attach user to request
        next();
      } catch (error) {
        res.status(401).json({ success: false, message: "Not authorized, invalid token!" });
      }
    } else {
      res.status(401).json({ success: false, message: "Not authorized, token not found!" });
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

//user authorization middleware
const authorizedUser = asyncHandler(async(req, res, next) => {
  //if req.user and req.user is isAdmin : false,
  if (req.user && !req.user.isAdmin) {
     next();
  }else{
    //if not
    return res.status(401).json({
      success : false,
      message : 'Not a normal user..'
    });
  }
})

export { authenticate, authorizedAdmin, authorizedUser };