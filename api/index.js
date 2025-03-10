import express from 'express';//we have used import express, not require('express') therefore type:"module" in package.json
const app=express();

app.listen(3000,()=>{
  console.log('server is running on port 3000');
})