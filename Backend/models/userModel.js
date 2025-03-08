import mongoose from "mongoose";

//User Schema for creating User model 
const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    },

    isAdmin : {
        type : Boolean,
        required : true,
        default : false
    },
    address:{
            fullName: { type: String },
            phone: { type: String},
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String },
            country: { type: String }
    },

}, {timestamps : true});

const User = mongoose.model("User", userSchema);

export default User;