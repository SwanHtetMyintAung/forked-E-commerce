import express from "express";
import formidable from 'express-formidable'
import 
{ 
    addProductReview,
    createProduct,
    deleteProductById,
    fetchAllProducts,
    fetchProductById,
    fetchProducts,
    fetchTopProducts,
    filterProducts,
    updateProduct
 } 
from "../controllers/productController.js";
import { authenticate, authorizedAdmin } from "../middlewares/authMiddleware.js";

//init the express for routes
const router = express.Router();


//fetch products
router.get('/all', fetchProducts);
//fetch product details
router.get('/details/:id', fetchProductById);
//fetch all products
router.get('/allProducts', fetchAllProducts);
//fetch product by rating
router.get('/topProduct', fetchTopProducts);
//fliter products
router.post('/filter', filterProducts);



//Authenticate Routes 
//add the reviews to product 
router.post('/addReview/:id', authenticate, addProductReview);

//Authenticate & Authorized Admin Routes
//create the product
router.post('/create', authenticate, authorizedAdmin, formidable(), createProduct);
//update the product
router.put('/update/:id', authenticate, authorizedAdmin, formidable(), updateProduct);
//deltete the product
router.delete('/delete/:id', authenticate, authorizedAdmin, deleteProductById);

export default router;