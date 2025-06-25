
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
require('dotenv').config();
const memberController = require(`./controllers/memberController`)

const app = express();

// MongoDB connection
mongoose.connect(process.env.URI, {
}).then(() => {
    console.log('Connected to game-simulator database');
}).catch((err) => {
    console.log('Error connecting to database', err);
});

// Express setup
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'

}));


app.use('/api/member', memberController); 
// app.post("/api/user/signUp", signUpUser)
// app.post("/api/user/login", loginUser)

// Start the server
app.listen(5000, () => {
    console.log("App is running on port 5000");
});