import Product from "../models/productModel.js";
import asyncHandler from '../middlewares/asyncHandler.js'
import mongoose from "mongoose";
import Category from '../models/categoryModel.js'
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

<<<<<<< HEAD

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



=======
const __filename = fileURLToPath(import.meta.url);//get the url of this file
const __dirname = dirname(dirname(dirname(__filename)));//get to the root folder of the project

function getProductsWithImages(products){
    return products.map(product => ({
        ...product.toObject(),
        image:fs.readFileSync(__dirname+product.image).toString("base64"),
    }));
}
>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443
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
<<<<<<< HEAD




=======
>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443
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
<<<<<<< HEAD
=======
    const pageSize = Number(req.query.limit) || 6; // Number of products per page
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

>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443
    try {
        const pageSize = Number(req.query.pageSize) || 6;
        const page = Number(req.query.page) || 1;
        const categoryName = req.query.category || null; // Get category name from query params
        const searchTerm = req.query.search ? { name: { $regex: req.query.search, $options: "i" } } : {}; 

        let filter = { ...searchTerm };

<<<<<<< HEAD
        if (categoryName && categoryName !== "All") {
            // 🔵 Find category ObjectId from category name
            const category = await Category.findOne({ name: categoryName });
            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
=======
            // Calculate if there are more pages
            const hasMore = page < Math.ceil(count / pageSize);
            const productsWithImages = getProductsWithImages(products)
            const fullResponse = {
                productsWithImages,
                page,
                pages: Math.ceil(count / pageSize),
                hasMore,
>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443
            }

            filter.category = category._id; // Set category ID as filter
        }

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
<<<<<<< HEAD





=======
>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443
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
    //   console.log(hasMore)
    //   // Modify image URLs to point to the image-serving API
    //   const productsWithImages = products.map(product => ({
    //     ...product.toObject(),
    //     image:fs.readFileSync(__dirname+product.image).toString("base64"),
    //  }));
    // const fullResponse = {
    //     productsWithImages,
    //     page,
    //     pages: Math.ceil(count / pageSize),
    //     hasMore,
    // }
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

//filter products
// const filterProducts = asyncHandler(async (req, res) => {
//     try {
//       const { checked = [], radio = [] } = req.body;
  
//       // Initialize query arguments
//       let args = {};
  
//       // Validate and add category filter
//       if (Array.isArray(checked) && checked.length > 0) {
//         const validCategories = checked.filter((id) =>
//           mongoose.Types.ObjectId.isValid(id)
//         );
//         if (validCategories.length > 0) {
//           args.category = { $in: validCategories }; // Use $in for matching multiple categories
//         }
//       }
  
//       // Validate and add price range filter
//       if (Array.isArray(radio) && radio.length === 2) {
//         const [min, max] = radio;
//         if (!isNaN(min) && !isNaN(max)) {
//           args.price = { $gte: min, $lte: max };
//         }
//       }
  
//       // Fetch products based on filters
//       const products = await Product.find(args);
//       return res.status(200).json({ success: true, data: products });
//     } catch (error) {
//       console.error("Error in filterProducts:", error.message);
//       return res.status(500).json({ success: false, error: "Server Error" });
//     }
//   });
// Filter products based on category and search term
const filterProducts = async (req, res) => {
    try {
<<<<<<< HEAD
        const { category, searchTerm } = req.query; // Extract query parameters

        let filter = {}; // Initialize filter object

        // Handle category filtering
        if (category && category !== "all") {
            const categoryFromDb = await Category.findOne({ name: { $regex: new RegExp(category, "i") } });

            if (categoryFromDb) {
                filter.category = categoryFromDb._id; // Assign category ID
            }
        }

        // Handle search filtering
        if (searchTerm && searchTerm.trim() !== "") {
            filter.name = { $regex: searchTerm, $options: "i" }; // Case-insensitive search
        }

        // Fetch products based on filter
        const products = await Product.find(filter).populate("category");

        // ✅ Ensure each product includes a **full image URL**
        const productsWithImages = products.map(product => ({
            ...product.toObject(),
            image: product.image ? `${process.env.BASE_URL || "http://localhost:5000"}${product.image}` : null,
        }));

        return res.status(200).json({ success: true, data: productsWithImages });

    } catch (error) {
        console.error("Error filtering products:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


=======
        const { category, searchTerm, } = req.query;
        const pageSize = Number(req.query.limit) || 12;
        const page = req.query.page || 1;

        // Build the query object based on parameters
        let filter = {};

        if (category && category !== 'all') {  // Use !== for strict comparison
            const categoryFromDb = await Category.find({ name: { $regex: new RegExp(category, "i") } });

            if (categoryFromDb.length > 0) {
                filter.category = categoryFromDb[0]._id;
            } else {
                return res.status(404).json({ success: false, message: "Category not found" });
            }
        }

        if (searchTerm) {
            filter.name = { $regex: searchTerm, $options: 'i' };
        }

        const count = await Product.countDocuments({ ...filter });
        //make the results have limits 
        const products = await Product.find(filter)
                                .limit(pageSize)
                                .skip((page - 1) * pageSize)
                                .populate("category")
                                .exec();
        const productsWithImages = getProductsWithImages(products);
        const fullResponse = {
            productsWithImages,
            page,
            pages : Math.ceil(count / pageSize),
            hasMore : page < Math.ceil(count / pageSize) //if the current page is less than the available pages
        }
        // Send back the filtered products
        return res.status(200).json({ success: true, data: fullResponse });
    } catch (error) {
        console.error('Error filtering products:', error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443


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