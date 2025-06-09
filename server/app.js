const express = require('express')
require('dotenv').config()

const connectDB = require('./config/db')
connectDB()

const app = express();

app.get("/", (req, res)=>{
    res.send("all set for the project and database connected")
})

app.listen(process.env.PORT);