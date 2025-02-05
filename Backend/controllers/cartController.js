import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// @desc   Get user cart
// @route  GET /api/cart
// @access Private
const getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate("cartItems.product");

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
});

// @desc   Add product to cart
// @route  POST /api/cart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        // If the user has no cart, create a new one
        cart = new Cart({
            user: req.user._id,
            cartItems: [],
            totalPrice: 0,
        });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.cartItems.push({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity,
        });
    }

    // Recalculate total price
    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json(cart);
});

// @desc   Update cart item quantity
// @route  PUT /api/cart/:itemId
// @access Private
const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.cartItems.find((item) => item._id.toString() === req.params.itemId);
    if (!item) {
        return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
        cart.cartItems = cart.cartItems.filter((item) => item._id.toString() !== req.params.itemId);
    } else {
        item.quantity = quantity;
    }

    // Recalculate total price
    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json(cart);
});

// @desc   Remove item from cart
// @route  DELETE /api/cart/:itemId
// @access Private
const removeCartItem = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    cart.cartItems = cart.cartItems.filter((item) => item._id.toString() !== req.params.itemId);

    // Recalculate total price
    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json(cart);
});

// @desc   Clear user cart (After checkout)
// @route  DELETE /api/cart
// @access Private
const clearCart = asyncHandler(async (req, res) => {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: "Cart cleared successfully" });
});

export { getUserCart, addToCart, updateCartItem, removeCartItem, clearCart };
