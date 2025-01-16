//Packages 
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';


//userRoute
import userRoutes from './routes/userRoute.js';
//categort Route
import categoryRoutes from './routes/categoryRoute.js';
//product Route
import productRoutes from './routes/productRoute.js';
//file upload Route
import uploadRoute from './routes/uploadRoute.js';
//order Rotues
import orderRoutes from './routes/orderRoute.js';

//Functions in local seperated files
import connectDB from './config/db.js';


//config
dotenv.config();
const port = process.env.PORT || 5000;


//recall the connectDB function
connectDB();

//init the expressjs for  port
const app  = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());


//test routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoute)
app.use('/api/orders', orderRoutes);


app.listen(port, () => console.log(`Server is running on port ${port}`));


