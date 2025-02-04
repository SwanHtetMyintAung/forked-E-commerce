import Product from "../models/productModel.js";
import asyncHandler from '../middlewares/asyncHandler.js'
import mongoose from "mongoose";
import Category from '../models/categoryModel.js'
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to delete an image from local storage
const deleteImage = (imagePath) => {
    if (!imagePath || imagePath === "/default-image.jpg") return; // Skip if default image

    const fullPath = path.join(__dirname, "..", imagePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath); // Delete the file
        console.log(`🗑️ Deleted Image: ${fullPath}`);
    }
};

//create product 
const createProduct = asyncHandler(async (req, res) => {
    //Extract the datas from req.fields
    const { name, image, brand, quantity, category, description, price } = req.body;
    
    // Validation for product creation
    switch (true) {
        case !name || !name.trim():
            return res.status(400).json({ message: "Name field is required." });
        case !image || !image.trim():
            return res.status(400).json({ message: "Image field is required." });
        case !brand || !brand.trim():
            return res.status(400).json({ message: "Brand field is required." });
        case !quantity || isNaN(quantity):
            return res.status(400).json({ message: "Quantity field must be a valid number." });
        case !category || !mongoose.Types.ObjectId.isValid(category):
            return res.status(400).json({ message: "Invalid category ID." });
        case !description || !description.trim():
            return res.status(400).json({ message: "Description field is required." });
        case !price || isNaN(price):
            return res.status(400).json({ message: "Price field must be a valid number." });
    }


    try {
        // Create and save the product
        const product = new Product({ name, image, brand, quantity, category, description, price });
        await product.save();

        return res.status(201).json({
            success: true,
            message: "Product has been successfully created.",
            data: product,
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid data type for a field.",
                error: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Server error. Could not create product.",
            error: error.message,
        });
    }
});
//product update
const updateProduct = asyncHandler(async (req, res) => {
    console.log("🔹 Incoming Request:", req.method, req.url);
    console.log("📦 Request Body:", req.body);

    const { name, image, brand, quantity, category, description, price } = req.body;

    // Validation for product creation
    switch (true) {
        case !name || !name.trim():
            return res.status(400).json({ message: "Name field is required." });
        case !image || !image.trim():
            return res.status(400).json({ message: "Image field is required." });
        case !brand || !brand.trim():
            return res.status(400).json({ message: "Brand field is required." });
        case !quantity || isNaN(quantity):
            return res.status(400).json({ message: "Quantity field must be a valid number." });
        case !category || !mongoose.Types.ObjectId.isValid(category):
            return res.status(400).json({ message: "Invalid category ID." });
        case !description || !description.trim():
            return res.status(400).json({ message: "Description field is required." });
        case !price || isNaN(price):
            return res.status(400).json({ message: "Price field must be a valid number." });
    }

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

         // If new image is uploaded, delete the old image
         if (image && product.image && image !== product.image) {
            deleteImage(product.image);
        }

        product.name = name;
        product.image = image || product.image;
        product.brand = brand;
        product.quantity = quantity;
        product.category = category;
        product.description = description;
        product.price = price;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("❌ Update Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
//delete products
const deleteProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate if `id` is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID.",
        });
    }

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).json({
            success : false,
            message : "Product Not Found."
        });
    }
       // Delete image from local storage
       deleteImage(product.image);

    try {
        // Attempt to delete the product
        const result = await Product.deleteOne({ _id: id });

        // Check if the product was actually deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Product already deleted.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product successfully deleted.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error.",
            error: error.message,
        });
    }
});
//fetch products
const fetchProducts = asyncHandler(async (req, res) => {
        const pageSize = Number(req.query.pageSize) || 6;
        const page = Number(req.query.page) || 1;
        const categoryName = req.query.category || null; // Get category name from query params
        const searchTerm = req.query.search ? { name: { $regex: req.query.search, $options: "i" } } : {}; 

        let filter = { ...searchTerm };
        if (categoryName && categoryName !== "All") {
            // 🔵 Find category ObjectId from category name
            const category = await Category.findOne({ name: categoryName });
            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }

            filter.category = category._id; // Set category ID as filter
        }
        try {

        const count = await Product.countDocuments(filter);
        let productsQuery = Product.find(filter).populate("category", "name");

        if (categoryName === "All" || count > pageSize) {
            productsQuery = productsQuery.skip(pageSize * (page - 1)).limit(pageSize);
        }

        const products = await productsQuery;
        const totalPages = Math.ceil(count / pageSize);

        return res.status(200).json({
            success: true,
            data: { products, page, pages: totalPages },
        });
    } catch (error) {
        console.error("🔴 Backend Error:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

//fetch product by ID
const fetchProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate if `id` is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID.",
        });
    }

    try {
        // Fetch the product by ID
        const product = await Product.findById(id);

        // Check if product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error. Could not fetch product.",
            error: error.message,
        });
    }
});
//fetch all products
const fetchAllProducts = asyncHandler(async (req, res) => {
    const pageSize = req.query.limit || 12
    const page = req.query.page || 1
    try {
      // Fetch products with category populated, sorted by creation date, and limited to 12 items
      const count = await Product.countDocuments({});
      const products = await Product.find({})
        .populate("category")
        .limit(pageSize)
        .skip(pageSize * (page-1))
        .sort({ createdAt: -1 }); // Ensure the field name matches your schema
      // Return success response
      const hasMore = page < Math.ceil(count / pageSize);
    res.status(200).json({
        success: true,
        data:{
            products : products,
            page : page,
            pages : Math.ceil(count/pageSize),
            hasMore
        },    
    });
    } catch (error) {  
        // Return error response
        res.status(500).json({
        success: false,
        message: "Server Error. Could not fetch products.",
        error: error.message, // Include error message for debugging
    });
    }
});
//Add product reviews
const addProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body; // Extract rating and comment
    const productId = req.params.id; // Extract product ID from route params

     // Validate if `id` is a valid MongoDB ObjectId
     if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID.",
        });
    }

    try {
        // Fetch the product by ID
        const product = await Product.findById(productId);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        // Check if the user has already reviewed the product
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "Product is already reviewed.",
            });
        }

        // Prepare the new review object
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        // Add the review to the product's reviews array
        product.reviews.push(review);

        // Update product review count
        product.numReviews = product.reviews.length;

        // Recalculate the product's average rating
        product.rating =
            product.reviews.reduce((acc, item) => acc + item.rating, 0) /
            product.reviews.length;

        // Save the updated product
        await product.save();

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Review added successfully to product.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error. Could not add review.",
            error: error.message,
        });
    }
});
//fetch top products
const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
        // Get limit from query or default to 6
        const limit = Number(req.query.limit) || 6;

        // Fetch products sorted by rating in descending order
        const products = await Product.find({})
            .sort({ rating: -1 })
            .limit(limit)

        // Return response
        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        // Return error response
        return res.status(500).json({
            success: false,
            message: "Server error. Could not fetch top products.",
            error: error.message,
        });
    }
});





export {
    createProduct,
    updateProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    deleteProductById
}