import express from "express";
import 
{
  countTotalOrders,
  createOrder,
  findOrderById,
  getAllOrders,
  getOrderByUser,
  markOrderAsDelivered,
  markOrderAsPaid,
  totalSales,
  totalSalesByDate
} from "../controllers/orderController.js";
import { authenticate, authorizedAdmin } from "../middlewares/authMiddleware.js";


//init the express for rotues
const router = express.Router();


//Public Routes
//count total orders
router.get('/total', countTotalOrders);
//count total sales
router.get('/sales', totalSales);
//count total sales by date
router.get('/salesByDate', totalSalesByDate);
//get all orders
router.get('/all',authenticate, authorizedAdmin, getAllOrders);
//get order by ID
router.get('/:id', findOrderById);


//Private Routes
//Only Authenticate Routes
//get all orders by logged in user
router.get('/fetchOrderByUser', authenticate, getOrderByUser);
//mark order as paid
router.put('/:id/paid', authenticate,  markOrderAsPaid);


//Both Authenticate and Authorized Admin Routes
//create order
router.post('/create', authenticate, authorizedAdmin, createOrder);
//mark order as delivered
router.put('/:id/delivered', authenticate, authorizedAdmin, markOrderAsDelivered);
      


export default router;