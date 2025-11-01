require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require("express-session");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
        secret: process.env.SESSION_SECRET || "secretkey",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60,
        },
    })
);

app.use(express.json());

const memberRoute = require('../routes/memberRoute');
app.use('/api/member', memberRoute);

const productRoute = require('../routes/productRoute');
app.use('/api/products', productRoute);

const logincheck = require('../routes/logincheck');
app.use('/api/logincheck', logincheck)

const receiptRoute = require('../routes/receiptRoute');
app.use('/api/receipt', receiptRoute);

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Success connected to MongoDB!');
        app.listen(PORT, () => {
            console.log(`Backend server is Running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Could not connect to MongoDB..', err));