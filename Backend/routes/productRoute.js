import express from "express";
import formidable from "express-formidable";
import {
  addProductReview,
  createProduct,
  deleteProductById,
  fetchAllProducts,
  fetchProductById,
  fetchProducts,
  fetchTopProducts,
  filterProducts,
  updateProduct,
} from "../controllers/productController.js";
import { authenticate, authorizedAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", fetchProducts);
router.get("/details/:id", fetchProductById);
router.get("/allProducts", fetchAllProducts);
router.get("/topProduct", fetchTopProducts);
router.get("/filter", filterProducts);

router.post("/addReview/:id", authenticate, addProductReview);
router.post("/create", authenticate, authorizedAdmin, createProduct);
router.put("/update/:id", authenticate, authorizedAdmin,  updateProduct);
router.delete("/delete/:id", authenticate, authorizedAdmin, deleteProductById);

export default router;
