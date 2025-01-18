import Product from "../models/productModel.js";
import asyncHandler from '../middlewares/asyncHandler.js'
import mongoose from "mongoose";
import Category from '../models/categoryModel.js'

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
const updateProduct = asyncHandler(async(req, res) => {
    //Extract the datas from req.fields
    const { name, image, brand, quantity, category, description, price } = req.fields;

    // Validation for product updation
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
        // Update and save the product
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, image, brand, quantity, category, description, price },
            { new : true}
        );
        await product.save();

        return res.status(201).json({
            success: true,
            message: "Product has been successfully uptaded.",
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
            message: "Server error. Could not update product.",
            error: error.message,
        });
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

    try {
        // Attempt to delete the product
        const result = await Product.deleteOne({ _id: id });

        // Check if the product was actually deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found or already deleted.",
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
    const pageSize = 6; // Number of products per page
    const page = Number(req.query.page) || 1; // Get page number from query, default to 1

    // Check if a keyword is provided for filtering
    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: "i", // Case-insensitive search
              },
          }
        : {};

    try {
        // Count total number of products matching the keyword
        const count = await Product.countDocuments({ ...keyword });

        // Fetch products with pagination
        const products = await Product.find({ ...keyword })
            .skip(pageSize * (page - 1)) // Skip products for previous pages
            .limit(pageSize); // Limit results to page size

        // Calculate if there are more pages
        const hasMore = page < Math.ceil(count / pageSize);

        return res.status(200).json({
            success: true,
            data: {
                products,
                page,
                pages: Math.ceil(count / pageSize),
                hasMore,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error. Could not fetch products.",
            error: error.message,
        });
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
    try {
      // Fetch products with category populated, sorted by creation date, and limited to 12 items
      const products = await Product.find({})
        .populate("category")
        .limit(12)
        .sort({ createdAt: -1 }); // Ensure the field name matches your schema
  
      // Return success response
      res.status(200).json({
        success: true,
        data: products,
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

//filter products
const filterProducts = asyncHandler(async (req, res) => {
    try {
      const { checked = [], radio = [] } = req.body;
  
      // Initialize query arguments
      let args = {};
  
      // Validate and add category filter
      if (Array.isArray(checked) && checked.length > 0) {
        const validCategories = checked.filter((id) =>
          mongoose.Types.ObjectId.isValid(id)
        );
        if (validCategories.length > 0) {
          args.category = { $in: validCategories }; // Use $in for matching multiple categories
        }
      }
  
      // Validate and add price range filter
      if (Array.isArray(radio) && radio.length === 2) {
        const [min, max] = radio;
        if (!isNaN(min) && !isNaN(max)) {
          args.price = { $gte: min, $lte: max };
        }
      }
  
      // Fetch products based on filters
      const products = await Product.find(args);
      return res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error("Error in filterProducts:", error.message);
      return res.status(500).json({ success: false, error: "Server Error" });
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
    filterProducts,
    deleteProductById
}