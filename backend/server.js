import app  from './app.js';
import dotenv from 'dotenv';
dotenv.config({path : './config/.env'});
import {v2 as cloudinary} from 'cloudinary'
import Razorpay from 'razorpay';
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})


// const port = process.env.PORT || 8000;

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});


// const server = app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// process.on('unhandledRejection',(err)=>{
//     console.log(`Error : ${err.message}`);
//     console.log(`Server is shutting down , due to unhandled promise rejection`);
//     server.close(()=>{
//         process.exit(1)
//     })
// })

export default app;
