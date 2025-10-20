import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());


import userRouter from './routes/user.routes.js'

app.use('/api/user', userRouter);

import connectDB from './config/db.config.js'
connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on Port ${port}`));