import express from 'express';
const app = express();
import ConnectDB from './config/database.js';
import productRouter from './routers/productRoutes.js';
import userRouter from './routers/userRoutes.js';
import orderRouter from './routers/orderRoutes.js';
import payment from './routers/paymentRoutes.js';
import errorHandler from './middleware/error.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';


// Connect to the database
ConnectDB();
// Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//     console.log(`Error : ${err.message}`);
//     console.log(`Shutting down the server due to uncaught exception`);
//     process.exit(1);
// })

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(fileUpload())
 
//Router
app.use('/api/v1', productRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', payment);

app.use(errorHandler);
dotenv.config({ path: 'backend/config/.env' });



export default app;