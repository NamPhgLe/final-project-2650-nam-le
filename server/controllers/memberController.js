const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const user = require(`${__dirname}/../models/user`);

const memberController = express.Router();

// MongoDB connection setup
const uri = process.env.URI || 'mongodb://127.0.0.1:27017/game-simulator';
const client = new MongoClient(uri);
let authenticated = [];

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
memberController.post('/signup', async (request, response) => {
    const collection = client.db().collection('members');
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({
            error: "Email and password are required.",
        });
    }

    const existing = await collection.findOne({ email });

    if (existing) {
        return response.status(200).json({
            error: `Email already exists. Choose a different one.`,
        });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const newMember = user(email, hashed);

    await collection.insertOne(newMember);
    authenticated.push(email);

    response.status(200).json({
        success: {
            email,
            message: `${email} was added successfully to members.`,
        },
    });
});

// Signin Route
memberController.post('/signin', async (request, response) => {
    const collection = client.db().collection('members');
    const { email, username, password } = request.body;

    if ((!email && !username) || !password) {
        return response.status(400).json({
            error: "Email and password are required.",
        });
    }
    const query = email ? {email} : {username};
    const member = await collection.findOne(query);

    if (!member) {
        return response.status(200).json({
            error: `Email or password is incorrect.`,
        });
    }

    const isMatched = await bcrypt.compare(password, member.hashedPassword);
    console.log()
    if (!isMatched) {
        return response.status(200).json({
            error: `Email or password is incorrect.`,
        });
    }

    authenticated.push(member.email);
    response.status(200).json({
        success: `${member.email} logged in successfully!`,
    });
});

// Signout Route
memberController.post('/signout', (request, response) => {
    const { email } = request.body;

    authenticated = authenticated.filter((e) => e !== email);
    console.log("authenticated", authenticated);

    response.status(200).json({
        success: {
            email,
            message: `${email} logged out successfully.`,
        },
    });
});

module.exports = memberController;
