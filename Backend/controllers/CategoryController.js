import asyncHandler from '../middlewares/asyncHandler.js'
import validator from 'validator'
import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';

const createCategory = asyncHandler(async (req,res)=>{
    //extract data
    const {categoryName} = req.body;
    //check the data is valid
    if(!categoryName){
        return res.status(400).json({
            success:false,
            message:"The name field is required!"
        })
    }
    // Validation : check if the categoryName is longer than 32
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
});


// ✅ Fix: Update Category Controller
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { categoryName } = req.body;

    try {
        // ✅ Check if category exists
        let category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found!",
            });
        }

        // ✅ Update the category name
        category.name = categoryName;
        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({
            success: false,
            message: `Error updating category: ${error.message}`,
        });
    }
});

const getCategory = asyncHandler(async(req, res) => {
    const categories = await Category.find({});
    return res.status(200).json({
        success : true,
        data : categories
    });
});


const getAllCategory = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 5;

    try {
        // ✅ Fix: Use `Category.countDocuments()` instead of just `countDocuments()`
        const count = await Category.countDocuments();

        // ✅ Fix: Check if `count` is 0 before fetching categories
        if (count === 0) {
            return res.status(404).json({
                success: false,
                message: "There are no categories yet!",
            });
        }

        // ✅ Fix: Ensure `categories` is always an array
        const categories = await Category.find({})
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        const hasMore = page < Math.ceil(count / pageSize);

        return res.status(200).json({
            success: true,
            data: {
                categories,
                page,
                pages: Math.ceil(count / pageSize),
                hasMore,
            },
        });
    } catch (error) {
        console.error("Error fetching categories:", error); // ✅ Debugging
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
});


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
    const category = await Category.find( { "name" : { $regex : new RegExp(categoryName, "i") } } );
    //in case it isn't found
    if(!category || !category.length){
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
// const deleteCategory = asyncHandler(async (req,res)=>{
//     //we can also use the category id here but i think name might be more convienient
//     const {categoryName} = req.params;
//     const category = await Category.find( { "name" : { $regex : new RegExp(categoryName, "i") } } );
//     //in case nothing was found
//     if(!category){
//         return res.status(404).json({
//             success:false,
//             message:"Category Not Found!"
//         })
//     }
//     await category[0].deleteOne();

//     return res.status(200).json({
//         success:true,
//         message:"Category deleted successfully!"
//     })
// })

const deleteCategory = asyncHandler(async (req, res) => {
    // Extract the ID from request parameters
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid object ID.",
        });
    }

    try {
        // Find and delete the category in one step
        const category = await Category.findByIdAndDelete(id);

        // If category does not exist, return a 404 error
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Category could not be deleted.",
            error: error.message,
        });
    }
});


export {
    createCategory,
    updateCategory,
    getAllCategory,
    getCategory,
    getCategoryById,
    getCategoryByName,
    deleteCategory
}