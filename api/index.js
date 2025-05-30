import express from 'express';//we have used import express, not require('express') therefore type:"module" in package.json

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js'

import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose
.connect(process.env.MONGO)
.then(() => {console.log('Mongodb is connected')})
.catch((err) => {console.log(err)});


const __dirname= path.resolve();

const app=express();
app.use(express.json());
app.use(cookieParser());//because we want to extract cookie from browser

app.listen(3000,()=>{
  console.log('server is running on port 3000');
})


app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


//middleware to handle errors
app.use((err,req,res,next)=>{
const statusCode= err.statusCode || 500;
const message= err.message || 'Internal Server error';
res.status(statusCode).json({
 success:false,
 statusCode,
 message,
});
});