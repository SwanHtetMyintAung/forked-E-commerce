import User from "../models/userModel.js"


async function registerController(req,res){
    //extract the required data
    const {name,email,password}= req.body;
    //check if the data are there
    if(!name || !email || !password){
        return res.status(400).json({
            message:"All fields are required!"
        })
    }
    //check if there any users with the same email already
    const existingUser =await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            message:"User with This email already exists!"
        })
    }
    //this will happen if there wasn't any user with the email
        //save the new user into db
    const newUser = new User({name, email, password});
    const savedUser = await newUser.save();
    //if something went wrong in saving the instance
    if(!savedUser){
        return res.status(500).json({
            message:"Server Error At Saving New User"
        })
    }

    //this will happens if everything go smoothly
    res.status(201).json(savedUser); 
    
}
//make an object including every controllers in this file so that we can export them as one
const allControllers = {
    registerController
}
export default allControllers