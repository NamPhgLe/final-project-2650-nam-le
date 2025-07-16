
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const memberController = require(`./controllers/memberController`)
const app = express();

require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.URI, {
}).then(() => {
    console.log('Connected to game-simulator database');
}).catch((err) => {
    console.log('Error connecting to database', err);
});

// Express setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use('/api/member', memberController); 

// Start the server
app.listen(5000, () => {
    console.log("App is running on port 5000");
});