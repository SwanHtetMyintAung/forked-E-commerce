import express from "express";
import {
    createCategory,
    updateCategory,
    getAllCategory,
    getCategoryById,
    getCategoryByName,
    deleteCategory,
    getCategory
} from "../controllers/CategoryController.js";
//middleware functions
import { authenticate, authorizedAdmin } from '../middlewares/authMiddleware.js'
//make a new router
const router = express.Router();

//you need to be an admin to create and get access to categories
router.post('/new', authenticate, authorizedAdmin, createCategory);
//update category
router.put("/update/:id",authenticate, authorizedAdmin, updateCategory);
//get every category with pagination
router.get("/all", getAllCategory);
//get all category without pagination
router.get("/categories", getCategory);
//with category name
router.route("/name/:categoryName")
    .get(authenticate,getCategoryByName)
    // .delete(authenticate, authorizedAdmin, deleteCategory);
//delete category by ID
router.delete("/delete/:id", authenticate, authorizedAdmin, deleteCategory);
//get a single category with an ID
router.get("/:id",authenticate, authorizedAdmin, getCategoryById);
//get category with a Name (if the database have more than one cateogories with same name , it will return all of the model with same name)

export default router;
