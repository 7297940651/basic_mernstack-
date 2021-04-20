const dotenv=require("dotenv")
const mongoose=require('mongoose')
const express=require("express")
const cookieParser=require('cookie-parser')
const app=express()

app.use(cookieParser());

dotenv.config({path:'./config.env'}) //securing password

const PORT=process.env.PORT||5000

//mongoose connection
require('./db/conn')

app.use(express.json())//convert json (middleware)

//const User=require('./model/userSchema')

app.use(require('./router/auth'))//link routers




// app.get('/about',(req,res)=>{
//     res.send("hello")
// })
// app.get('/contact',(req,res)=>{
//     res.send("hello")
// })

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"))
}

app.listen(PORT,()=>{
    console.log(`running on ${PORT}`)
})
