// Packages
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// User-defined Modules
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import productRoutes from './routes/productRoute.js';
import uploadRoute from './routes/uploadRoute.js';
import orderRoutes from './routes/orderRoute.js';
import cartRoutes from './routes/cartRoute.js';

// Configurations
dotenv.config();
const port = process.env.PORT || 5000;

// Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// Middlewares
app.use(cors({
 // Configure CORS
  origin: "http://localhost:5173", // Allow requests from frontend
  credentials: true, // Allow cookies, authentication headers // Allow cookies from frontend
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoute);
app.use('/api/orders', orderRoutes);
app.use('/api/carts',cartRoutes);

// Serve Static Files (Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// Start Server
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
