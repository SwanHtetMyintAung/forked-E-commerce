import express from "express";
import {
    createCategory,
    getAllCategory,
    getCategoryById,
    getCategoryByName,
    deleteCategory
} from "../controllers/CategoryController.js"
//middleware functions
import { authenticate, authorizedAdmin } from '../middlewares/authMiddleware.js'
//make a new router
const router = express.Router();

//you need to be an admin to create and get access to categories
router.post('/new', authenticate, authorizedAdmin, createCategory);
//get every category
router.get("/all", getAllCategory);
//get a single category with an ID
router.route("/name/:categoryName")
        .get(authenticate, authorizedAdmin, getCategoryByName)
        .delete(authenticate, authorizedAdmin, deleteCategory);
router.get("/:id",authenticate, authorizedAdmin, getCategoryById);
//get category with a Name (if the database have more than one cateogories with same name , it will return all of the model with same name)

export default router;
