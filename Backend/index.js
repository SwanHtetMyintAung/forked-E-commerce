//Packages 
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'


//userRoute
import userRoutes from './routes/userRoute.js'
//categort Route
import categoryRoutes from './routes/categoryRoute.js'

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
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)

app.listen(port, () => console.log(`Server is running on port ${port}`));


