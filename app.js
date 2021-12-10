//Include express
const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler')

//set up body parser
app.use(express.json());

//import dotenv to handle environment variables
const dotenv = require('dotenv');
//import database connection
const connectDatabase = require('./config/database');

//Setting up config.env file variables
dotenv.config({path: './config/config.env'})

//Handling uncaught exception
process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down due to uncaught exception.')
    process.exit(1);
})

//Connecting to database
connectDatabase();

//importing all routes
const jobs = require('./routes/jobs');

app.use('/api/v1', jobs);

// Handle unhandled routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));

});

const PORT = process.env.PORT;
const server = app.listen(PORT, ()=>{
    console.log(`Server start on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

//Middleware for errors
app.use(errorMiddleware)

module.exports = app;

// Handling unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`)
    console.log('Shutting down the server due to unhandled promise rejection.')
    server.close( () => {
        process.exit(1);
    })
});