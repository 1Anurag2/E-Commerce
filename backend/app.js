import express from 'express';
const app = express();
import ConnectDB from './config/database.js';
import Router from './routers/productRoutes.js';

// Connect to the database
ConnectDB();

// Middleware
app.use(express.json());

//Router
app.use('/api/v1', Router);



export default app;