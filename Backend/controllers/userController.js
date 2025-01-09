import User from "../models/userModel.js"
import asyncHandler from '../middlewares/asyncHandler.js'
import validator from 'validator'
import createToken from '../utils/createToken.js'
import bcrypt from 'bcrypt'
import mongoose from "mongoose"

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
        createToken(res, newUser._id);

        return res.status(201).json({
            success: true,
            message: "User successfully created.",
            data: newUser
        });
    } catch (error) {
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
            createToken(res, existingUser._id);
            return res.status(200).json({
                success : true,
                message : "User have successfully logged in.",
                data : existingUser
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











export {
     createUser,
     loginUser,
     logoutUser,
     getUserProfile,
     updateUserProfile,
     getUserById,
     updateUserById,
     deleteUserById
    }


