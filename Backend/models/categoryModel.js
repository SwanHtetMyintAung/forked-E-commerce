import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        maxLength:32
    }
})

const Category = mongoose.model("Category",categorySchema)

export default Category;