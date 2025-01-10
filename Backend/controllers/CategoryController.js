import asyncHandler from '../middlewares/asyncHandler.js'
import validator from 'validator'
import Category from '../models/categoryModel.js';

const createCategory = asyncHandler(async (req,res)=>{
    //extract data
    const {categoryName} = req.body;
    //check the data is valid
    if(!categoryName){
        return res.status(400).json({
            success:false,
            message:"The name is not valid!"
        })
    }
    // Validation : check if the password is longer than 32
    if (!validator.isLength(categoryName, { max: 32 })) {
        return res.status(400).json({
            success: false,
            message: "The Category Name can't be more than 32 characters!."
        });
    }
    //check if the category with this name already exist
    let existingCategory = await Category.findOne({name:categoryName});
    if(existingCategory){
        return res.status(400).json({
            success: false,
            message: "A Category with this name already exists."
        });
    }
    //making new instance of the model
    const newCategory = new Category({
        name : categoryName
    })
    try{
        await newCategory.save();
        return res.status(200).json({
            success:true,
            data:newCategory
        })
    }catch(e){
        return res.status(500).json({
            success:false,
            message:`Error at saving new Category : ${e.message}`,
        })
    }
})
const getAllCategory = asyncHandler(async (req,res)=>{
    //get literally every categories
    let categories = await Category.find();
    if(!categories){
        return res.status(404).json({
            success:false,
            message:"There are no current category yet!"
        })
    }
    return res.status(200).json({
        success:true,
        data:categories
    })
})
const getCategoryById = asyncHandler(async (req,res)=>{
    //data might come from the search param or the body
    const categoryId = req.params.id;//you can change here depends on where the category id will be coming from
    const category = await Category.findById(categoryId);
    if(!category){
        return res.status(404).json({
            success:false,
            message:"Category Not Found!"
        })
    }
    return res.status(200).json({
        success:true,
        data:category
    })
})
const getCategoryByName = asyncHandler(async (req,res)=>{
    //you can change here depends on where the category id will be coming from
    const {categoryName} = req.params;//req.body.name
    const category = await Category.find({ name : categoryName})
    //in case it isn't found
    if(!category){
        return res.status(404).json({
            success:false,
            message:"Category Not Found!"
        })
    }
    return res.status(200).json({
        success:true,
        data:category
    })
})
const deleteCategory = asyncHandler(async (req,res)=>{
    //we can also use the category id here but i think name might be more convienient
    const {categoryName} = req.params;
    const category = await Category.findOne({ name : categoryName})
    //in case nothing was found
    if(!category){
        return res.status(404).json({
            success:false,
            message:"Category Not Found!"
        })
    }
    await category.deleteOne();

    return res.status(200).json({
        success:true,
        message:"Category deleted successfully!"
    })
})

export {
    createCategory,
    getAllCategory,
    getCategoryById,
    getCategoryByName,
    deleteCategory
}