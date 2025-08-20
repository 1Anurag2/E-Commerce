import app  from './app.js';
import dotenv from 'dotenv';
dotenv.config({path : './config/.env'});

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Server is shutting down , due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1)
    })
})
