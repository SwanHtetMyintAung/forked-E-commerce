import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";


//Utility function
const calculatePrice = (orderItems, taxRate = 0.15) => {
    // Validate inputs
    if (!Array.isArray(orderItems) || orderItems.some(item => typeof item.price !== 'number' || typeof item.qty !== 'number')) {
        throw new Error('Invalid input: orderItems must be an array of objects with numeric price and qty properties.');
    }
    if (typeof taxRate !== 'number' || taxRate < 0 || taxRate > 1) {
        throw new Error('Invalid tax rate: must be a number between 0 and 1.');
    }

    // Constants
    const FREE_SHIPPING_THRESHOLD = 100;
    const FLAT_SHIPPING_FEE = 10;

    // Helper function to handle rounding
    const roundToTwo = (num) => Math.round(num * 100) / 100;

    // Calculate prices
    const itemsPrice = roundToTwo(orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = itemsPrice > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
    const taxPrice = roundToTwo(itemsPrice * taxRate);
    const totalPrice = roundToTwo(itemsPrice + shippingPrice + taxPrice);

    // Return formatted results
    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    };
};


//create order 
const createOrder = asyncHandler(async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        // Validate input
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No order items provided.",
            });
        }
        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Shipping address and payment method are required.",
            });
        }

        // Retrieve items from the database
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((item) => item.product) },
        });

        if (!itemsFromDB || itemsFromDB.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No matching products found in the database.",
            });
        }

        // Prepare dbOrderItems
        const dbOrderItems = orderItems.map((clientItem) => {
            const matchingDBItem = itemsFromDB.find(
                (dbItem) => dbItem._id.toString() === clientItem.product.toString()
            );

            if (!matchingDBItem) {
                throw new Error(`Product not found: ${clientItem.product}`);
            }

            return {
                product: clientItem.product,
                name: matchingDBItem.name,
                qty: clientItem.qty,
                price: matchingDBItem.price,
                image: matchingDBItem.image,
            };
        });

        // Calculate prices
        const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calculatePrice(dbOrderItems);

        // Create and save the order
        const order = new Order({
            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        return res.status(201).json({
            success: true,
            message: "Order created successfully.",
            data: createdOrder,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the order.",
            error: error.message,
        });
    }
});


//get all order by each user
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        // Extract query parameters for pagination and filtering
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        // Pagination logic
        const skip = (page - 1) * pageSize;

        // Retrieve orders with pagination, sorting, and user details
        const orders = await Order.find({})
            .populate("user", "id name email isAdmin")
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(pageSize);

        // Total count for all orders
        const totalOrders = await Order.countDocuments({});

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: page,
                pageSize,
                totalOrders,
                totalPages: Math.ceil(totalOrders / pageSize),
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving orders.",
            error: error.message,
        });
    }
});

//get order by logged in user
const getOrderByUser = asyncHandler(async (req, res) => {
    try {
        // Validate user ID
        if (!req.user || !req.user._id) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing or invalid.",
            });
        }

        // Extract query parameters for pagination and sorting
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        // Pagination logic
        const skip = (page - 1) * pageSize;

        // Fetch user orders with pagination and sorting
        const orders = await Order.find({ user: req.user._id })
            .populate("user", "id name email isAdmin")
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(pageSize);

        // Total count of user's orders
        const totalOrders = await Order.countDocuments({ user: req.user._id });

        // Return response
        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: page,
                pageSize,
                totalOrders,
                totalPages: Math.ceil(totalOrders / pageSize),
            },
        });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching orders.",
            error: error.message,
        });
    }
});

//total count of orders
const countTotalOrders = asyncHandler(async (req, res) => {
    try {
        const isPaid = req.query.isPaid === "true";
        const isDelivered = req.query.isDelivered === "true";

        // Build filter dynamically based on query parameters
        const filter = {};
        if (req.query.isPaid) filter.isPaid = isPaid;
        if (req.query.isDelivered) filter.isDelivered = isDelivered;

        // Count documents matching the filter
        const totalOrders = await Order.countDocuments(filter);

        return res.status(200).json({
            success: true,
            totalOrders,
        });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({
            success: false,
            message: "An error occurred while counting orders.",
            error: error.message,
        });
    }
});


//total sales
const totalSales = asyncHandler(async(req, res) => {
    try {
        //Use MongoDB aggregation to calculate total sales
        const result = await Order.aggregate([
            {
                $group : {
                    _id : null, //Group all documents
                    totalSales : { $sum : "$totalPrice"} //Sum up the totalPrice field
                }
            }
        ]);

        //Extract total sales or default to 0 if no orders exist
        const totalSales = result.length > 0 ? result[0].totalSales : 0;

        //Return the total sales
        return res.status(200).json({
            success : true,
             totalSales : totalSales
        });
    } catch (error) {
        return res.status(500).json({
            success  : false,
            error : error.message
        });
    }
});


//total sales by date
const totalSalesByDate = asyncHandler(async(req, res) => {
    try {
        //Aggregate total sales grouped by date for paid orders
        const salesByDate = await Order.aggregate([
            {
                //Filter : Only include paid orders
                $match : {
                    isPaid : true
                }
            },
            {
                //Group by date (format : YYYY-MM-DD) and calculate total sales
                $group : {
                    _id  : {
                        $dateToString : { format : "%Y-%m-%d", date : "$paidAt"}
                    },
                    totalSales : { $sum : "$totalPrice"}
                }
            },
            {
                $sort : { _id : 1}
            }
        ]);

        //Return the calculated sales data
        return res.status(200).json({
            success : true,
            totalSalesByDate : salesByDate
        })
    } catch (error) {
        //Handle errors and return a response
        return res.status(500).json({
            success : false,
            message : "An error occurred while calculation total sales by date.",
            error : error.message
        });
    }
});


//find order by id
const findOrderById = asyncHandler(async (req, res) => {
    try {
        // Extract the order ID from req.params
        const { id } = req.params;

        // Check if id valids
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success : false,
                message : "Invalid order ID."
            })
        }
        // Find the order by ID
        const order = await Order.findById(id).populate("user", "name email isAdmin");

        // Check if the order exists
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        // Return the order
        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the order.",
            error: error.message,
        });
    }
});


//mark order as paid
const markOrderAsPaid = asyncHandler(async(req, res) => {
    try {
        //Extract id from req.params
        const { id } = req.params;

        //Check if id valid 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return  res.status(400).json({
                success : false,
                message : "Invalid order ID."
            });
        }

        //Find order By ID
        const order = await Order.findById(id);

        //Check if order exists
        if (!order) {
            return res.status(404).json({
                success : false,
                message : "Order not found."
            });
        }

        //Update order payment status
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id : req.body.id || null,
            status : req.body.status || null,
            update_time : req.body.update_time || null,
            email_address  : req.body.email_address || null
        };

        //Save the updated order
        const updatedOrder = await order.save();

        //Respond with the updated order
        return res.status(200).json({
            success : true,
            message : "Order marked as paid successfully.",
            data : updatedOrder
        });
    } catch (error) {
        //Handle unexpected errors
        return res.status(500).json({
            success : false,
            message : "An error occurred while marking the order as paid.",
            error : error.message
        });
        
    }
});

//mark order as delivered
const markOrderAsDelivered = asyncHandler(async(req, res) => {
    try {
        //Extract id from req.params
        const { id } = req.params;

        //Check if id valids
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success : false,
                message : "Invalid order ID."
            });
        }

        //Find the order by ID
        const order = await Order.findById(id);

        //Check if order exists
        if (!order) {
            return res.status(404).json({
                success : false,
                message : "Order not found."
            });
        }

        //Update delivery status
        order.isDelivered = true,
        order.deliveredAt = Date.now();


        //Save the updated order
        const updatedOrder = await order.save();

        //Respond with the updated order
        return res.status(200).json({
            success : true,
            message : "Order marked as delivered successfully.",
            data : updatedOrder
        });
    } catch (error) {
        //Handle unexpected errors
        return res.status(500).json({
            success : false,
            message : "An error occurred while marking the order as delivered.",
            error  : error.message
        });
    }
});








export {
    createOrder,
    getAllOrders,
    getOrderByUser,
    countTotalOrders,
    totalSales,
    totalSalesByDate,
    findOrderById,
    markOrderAsPaid,
    markOrderAsDelivered
}

