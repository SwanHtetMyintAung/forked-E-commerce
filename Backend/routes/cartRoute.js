import express from "express";
import {
    getUserCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../controllers/cartController.js";
import { authenticate, authorizedUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(authenticate, authorizedUser, getUserCart)  // Get user cart
    .post(authenticate, authorizedUser, addToCart)  // Add to cart
    .delete(authenticate, authorizedUser, clearCart);  // Clear cart

router.route("/:itemId")
    .put(authenticate, authorizedUser, updateCartItem)  // Update cart item
    .delete(authenticate, authorizedUser, removeCartItem);  // Remove cart item

export default router;
