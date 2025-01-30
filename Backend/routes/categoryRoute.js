import express from "express";
import {
    createCategory,
    getAllCategory,
    getCategoryById,
    getCategoryByName,
    deleteCategory
} from "../controllers/categoryController.js"
//middleware functions
import { authenticate, authorizedAdmin } from '../middlewares/authMiddleware.js'
//make a new router
const router = express.Router();

//you need to be an admin to create and get access to categories
router.post('/new', createCategory);
//get every category
router.get("/all", getAllCategory);
//with category name
router.route("/name/:categoryName")
    .get(authenticate,getCategoryByName)
    .delete(authenticate, authorizedAdmin, deleteCategory);
//get a single category with an ID
router.get("/:id",authenticate, authorizedAdmin, getCategoryById);
//get category with a Name (if the database have more than one cateogories with same name , it will return all of the model with same name)

export default router;
