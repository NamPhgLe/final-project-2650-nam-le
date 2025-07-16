const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const user = require(`${__dirname}/../models/user`);

const memberController = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config();

//token generation
function generateToken(payload){
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
}

//authenticate check
function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
  
      req.user = user;
      next();
    });
  }

// protected 
memberController.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: "This is protected",
        user: req.user
    });
});

// MongoDB connection setup
const uri = process.env.URI || 'mongodb://127.0.0.1:27017/game-simulator';
const client = new MongoClient(uri);

(async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB from memberController");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
})();

const SALT_ROUNDS = 10;

// Signup Route
memberController.post('/signup', async (req, res) => {
    const collection = client.db().collection('members');
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required.",
        });
    }

    const existing = await collection.findOne({ email });

    if (existing) {
        return res.status(200).json({
            error: `Email already exists. Choose a different one.`,
        });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const newMember = user(email, hashed);

    await collection.insertOne(newMember);

    const token = generateToken({email});

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
        sameSite: 'lax',
    });

    res.status(200).json({
        success: {
            email,
            message: `${email} was added successfully to members.`,
            token
        },
    });
});

// Signin Route
memberController.post('/signin', async (req, res) => {
    const collection = client.db().collection('members');
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
        return res.status(400).json({
            error: "Email and password are required.",
        });
    }

    const query = email ? {email} : {username};
    const member = await collection.findOne(query);

    if (!member) {
        return res.status(200).json({
            error: `Email or password is incorrect.`,
        });
    }

    const isMatched = await bcrypt.compare(password, member.hashedPassword);
    if (!isMatched) {
        return res.status(200).json({
            error: `Email or password is incorrect.`,
        });
    }

    const token = generateToken({email: member.email})
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, 
        sameSite: 'lax',
    })
    res.status(200).json({
        success: `${member.email} logged in successfully!`,
        token
    });
});

// logout Route
memberController.post('/signout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      res.status(200).json({
        success: 'logged out successfully.'
    });
});

module.exports = memberController;
