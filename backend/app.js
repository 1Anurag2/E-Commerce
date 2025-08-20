import express from 'express';
const app = express();
import ConnectDB from './config/database.js';
import Router from './routers/productRoutes.js';
import errorHandler from './middleware/error.js';

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

//Router
app.use('/api/v1', Router);
app.use(errorHandler);



export default app;