import express from 'express';
const app = express();
import ConnectDB from './config/database.js';
import productRouter from './routers/productRoutes.js';
import userRouter from './routers/userRoutes.js';
import orderRouter from './routers/orderRoutes.js';
import errorHandler from './middleware/error.js';
import cookieParser from 'cookie-parser';

// Connect to the database
ConnectDB();
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
})

// Middleware
app.use(express.json());
app.use(cookieParser());
 
//Router
app.use('/api/v1', productRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', orderRouter);
app.use(errorHandler);



export default app;