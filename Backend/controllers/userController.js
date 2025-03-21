import User from "../models/userModel.js"
import asyncHandler from '../middlewares/asyncHandler.js'
import validator from 'validator'
import createToken from '../utils/createToken.js'
import bcrypt from 'bcrypt'
import mongoose from "mongoose"
import { _computeSegments } from "chart.js/helpers"

//create user
const createUser = asyncHandler(async (req, res) => {
    // Extract the required data from req.body
    const { name, email, password } = req.body;

    // Validation: Check if all required fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    // Validation: Check if the email is in the correct format
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });
    }

    // Validation: Check if the password is at least 8 characters long
    if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long."
        });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "A user with this email already exists."
        });
    }

    //lower the name and email
    const lowerName = name.toLowerCase();
    const lowerEmail = email.toLowerCase();

    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ name : lowerName, email : lowerEmail, password : hashedPassword});

    try {
        // Save the new user in the database
        await newUser.save();

        // Create and send a token to the frontend for the registered user
        const token = createToken(res, newUser._id);
        return res.status(201).json({
            success: true,
            message: "User successfully created.",
            data: newUser,
            token : token
        });
    } catch (error) {
        console.log(error)
        // Handle database or server errors
        return res.status(500).json({
            success: false,
            message: "Error creating the user."
        });
    }
});


//login user
const loginUser = asyncHandler(async(req, res) => {
    //Extract the user datas from req.body
    const { email, password } = req.body;
  
    //Validation : Check all required fields are provided
    if (!email || !password) {
        return res.status(400).json({
            success : false,
            message : "All fields are required."
        });
    }

    //Validation : Check if the email is in the correct format
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success : false,
            message : "Please provide a valid email address."
        })
    }

    //lower the email
   const lowerEmail = email.toLowerCase();

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({email : lowerEmail});
    if (existingUser) {
        // Check if password is valid or not for that user
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        //if password is valid
        if (isPasswordValid) {
           const token =  createToken(res, existingUser._id);
            return res.status(200).json({
                success : true,
                message : "User have successfully logged in.",
                data : existingUser,
                token : token
            });
        }else{
            //if password is not valid
            return res.status(400).json({
                success : false,
                message : "credentials does not match."
            });
        }
    }else{
        //User is not existed
        return res.status(404).json({
            success : false,
            message : "User not found."
        });
    }
});


const logoutUser = asyncHandler(async (req, res) => {
    // Clear the JWT token by setting it to an empty value and expiring it
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict' // Prevent CSRF attacks
    });

    return res.status(200).json({
        success: true,
        message: "User has successfully logged out."
    });
});


//get user profile
const getUserProfile = asyncHandler(async (req, res) => {
    // Retrieve user data from the database using the ID from the request object
    const user = await User.findById(req.user._id);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Respond with the user data
    return res.status(200).json({
        success: true,
        data: user
    });
});


//update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    // Retrieve user data from the database using the ID from the request object
    const user = await User.findById(req.user._id);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Update the name and email fields in the database
    if (req.body.name) {
        user.name = req.body.name.toLowerCase();
    }

    if (req.body.email) {
        // Validate the email format
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format."
            });
        }
        user.email = req.body.email.toLowerCase();
    }

    // Check if the password exists and validate/update it
    if (req.body.password) {
        const password = req.body.password;

        // Validation: Check if the password is at least 8 characters long
        if (!validator.isLength(password, { min: 8 })) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
        }

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user data
    const updatedUser = await user.save();

    return res.status(200).json({
        success: true,
        message: "User successfully updated.",
        data: updatedUser
    });
});



//get user by ID
const getUserById = asyncHandler(async (req, res) => {
    // Retrieve user by ID from the request parameters
    const user = await User.findById(req.params.id);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Return the user data
    return res.status(200).json({
        success: true,
        data: user
    });
});

//update user by ID
const updateUserById = asyncHandler(async(req, res) => {
    //Retrive user by ID from the request parameters
    const user = await User.findById(req.params.id);
    //Check if the user exists
    if (!user) {
        return res.status(404).json({
            success : false,
            message : "User not found."
        });
    }

      // Update the name and email fields in the database
      if (req.body.name) {
        user.name = req.body.name.toLowerCase();
    }

    if (req.body.email) {
        // Validate the email format
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format."
            });
        }
        user.email = req.body.email.toLowerCase();
    }

    // Check if the password exists and validate/update it
    if (req.body.password) {
        const password = req.body.password;

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Password didn't matched!"
            })
        }
        //if password is valid
        // Validation: Check if the new password is at least 8 characters long
        const newPassword = req.body.newPassword;
        if (!validator.isLength(newPassword, { min: 8 })) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long."
            });
        }

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
    }

    // Save the updated user data
    const updatedUser = await user.save();

    return res.status(200).json({
        success: true,
        message: "User successfully updated.",
        data: updatedUser
    });
});


//delete user by ID
const deleteUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID."
        });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Prevent deletion of admin users
    if (user.isAdmin) {
        return res.status(400).json({
            success: false,
            message: "Admin user cannot be deleted."
        });
    }

    // Delete the user
   const deleteUser =  await User.deleteOne({ _id: id });

    return res.status(200).json({
        success: true,
        message: "User has been successfully deleted.",
        data : deleteUser
    });
});

//get a list of every user
const getAllUsers = asyncHandler(async (req,res) =>{
    const {page,pageSize} = req.query;
    if(!mongoose.isValidObjectId(req.user._id) && !req.user.isAdmin){
        return res.status(403).json({
            success:false,
            message:"You are not authorized to do this"
        })
    }
    const count = await User.countDocuments();//total users
    const allUsers = await User.find({})
                                .skip(pageSize * (page-1))
                                .limit(pageSize);

    return res.status(200).json({
        success:true,
        data:allUsers,
        pages:Math.ceil(count/pageSize)
    })
})

const updateAddress = asyncHandler(async (req, res) => {
        // Check for missing user ID
        if (!req.body._id && (req.body._id == req.params.id)) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        // Fetch user from DB
        const userFromDb = await User.findById(req.params.id);//for some reasons req.body._id didn't work!!

        // Edge case: User not found
        if (!userFromDb) {
            return res.status(400).json({
                success: false,
                message: "Couldn't find the user!"
            });
        }

        // Extract and validate address object
        const address = req.body.address;
        if (!address) {
            return res.status(400).json({ error: "Address is required." });
        }

        const { fullName, phone, street, city, state, zipCode, country } = address;

        // Validate required fields
        if (!fullName || !phone || !street || !city || !state || !zipCode || !country) {
            return res.status(400).json({ error: "All address fields are required." });
        }

        // Validate phone number (10-15 digits)
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ error: "Invalid phone number format." });
        }

        // Validate Zip Code (5-10 alphanumeric characters)
        const zipRegex = /^[A-Za-z0-9]{5,10}$/;
        if (!zipRegex.test(zipCode)) {
            return res.status(400).json({ error: "Invalid zip code format." });
        }

        // Validate country (only alphabets & spaces)
        const countryRegex = /^[A-Za-z\s]{2,}$/;
        if (!countryRegex.test(country)) {
            return res.status(400).json({ error: "Invalid country name." });
        }

        // Update the user's address
        userFromDb.address = { fullName, phone, street, city, state, zipCode, country };

        // Save to DB
        await userFromDb.save();

        return res.status(200).json({
            success: true,
            message: "Successfully saved address.",
            data: userFromDb
        });


        // console.log(error.message);
        // return res.status(500).json({
        //     success: false,
        //     message: "Couldn't fulfill the request for updating address."
        // });
    
});


const checkHistory = asyncHandler(async (req,res)=>{
    // Check for missing user ID
    if (!req.body._id && (req.body._id == req.params.id)) {
        return res.status(400).json({ success: false, message: "User ID is required." });
    }
     // Fetch user from DB
     const userFromDb = await User.findById(req.params.id);

     if (!userFromDb) {
        return res.status(400).json({
            success: false,
            message: "Couldn't find the user!"
        });
    }

    if (!userFromDb.purchaseHistory) {
        userFromDb.purchaseHistory = [];
    }

    await userFromDb.populate("purchaseHistory.product")
    res.status(200).json({
        success:true,
        data:userFromDb.purchaseHistory
    })
})
const clearHistory = asyncHandler(async(req,res)=>{
     // Check for missing user ID
     if (!req.body._id && (req.body._id == req.params.id)) {
        return res.status(400).json({ success: false, message: "User ID is required." });
    }
     // Fetch user from DB
     const userFromDb = await User.findById(req.params.id);

     if (!userFromDb) {
        return res.status(400).json({
            success: false,
            message: "Couldn't find the user!"
        });
    }
    //clear the whole thing
    userFromDb.purchaseHistory = [];
    await userFromDb.save();

    res.status(200).json({
        success:true,
        message:"History Cleared."
    })

})



export {
     createUser,
     loginUser,
     logoutUser,
     getUserProfile,
     updateUserProfile,
     getUserById,
     updateUserById,
     deleteUserById,
     getAllUsers,
     updateAddress,
     checkHistory,
     clearHistory
    }


