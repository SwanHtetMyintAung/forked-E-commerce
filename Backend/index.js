//Packages 
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'


//controllers
import userController from "./controllers/userController.js"

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
app.post('/register',userController.registerController)

app.listen(port, () => console.log(`Server is running on port ${port}`));


