//Include express
const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errors');
//set up body parser
app.use(express.json());

//import dotenv to handle environment variables
const dotenv = require('dotenv');

const connectDatabase = require('./config/database');

//Setting up config.env file variables
dotenv.config({path: './config/config.env'})

//Connecting to database
connectDatabase();

//importing all routes
const jobs = require('./routes/jobs');

app.use('/api/v1', jobs);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server start on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

//Middleware for errors
app.use(errorMiddleware)

module.exports = app;