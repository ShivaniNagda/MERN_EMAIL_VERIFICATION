import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './db/connectDB.js';
import express from "express";

import server from './index.js';
const port = process.env.PORT || 3000;
// Start the server
server.use(express.json());
server.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
    });