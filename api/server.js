import express from 'express';
import bodyParser from 'body-parser';
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import pkg from 'mysql';
import UserModel from './models/User.js';
import multer from 'multer';
import path from 'path'
import cookieParser from 'cookie-parser';

import photoSessionRoutes from './routes/photoSessionRoutes.js'

import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from './config/db.js'; 

dotenv.config();
const { error } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'https://merry-dusk-e8dba6.netlify.app', // Adjust this to your Vite dev server's URL
    credentials: true, // Allow credentials to be sent
}));

  
app.use(bodyParser.json());

// dataBase conectivity
const initializeDatabase = async () => {
    try {
        await connect(); // Connect to the database
        await UserModel.sync({ force: false }); // Sync the UserModel (create table if it doesn't exist)
        console.log("User table has been created (if it didn't exist).");
    } catch (error) {
        console.error("Error during database initialization:", error.message);
    }
};

// Call the initialization function
initializeDatabase();


app.use(express.json())
app.use(cookieParser());
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/photoSession', photoSessionRoutes);
app.use('/images', express.static(path.resolve('public', 'images')));


app.use((error, req, res, next) => {
    const errorStatus = error.status || 500
    const errorMsg = error.message || "Somthing is wrong"
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMsg,
      stack: error.stack,
    })
  
    // return res.status(500).json("error find in page", Error)
  })
  

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
