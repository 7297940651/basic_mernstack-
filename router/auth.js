const express=require('express')

const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const authenticate=require("../middleware/authenticate")


const router=express.Router()

require('../db/conn')
const User=require('../model/userSchema')

router.get('/',(req,res)=>{
    res.send("hello router")
})

router.post('/register',async(req,res)=>{
    const {name,email,phone,work,password,cpassword}=req.body

    if(!name|| !email|| !phone|| !work|| !password|| !cpassword)
     return res.status(422).json({error:"fill all fields"})

     try{
        const userExist=await User.findOne({email:email});

        if(userExist){
             return res.status(422).json({error:"email exists"})
             }
             else if(password!=cpassword){
                return res.status(422).json({error:"password not matching"})
             }
             else{

        const user=new User({name,email,phone,work,password,cpassword})
        //before saving data hash password using middleware
        const userRegister=await user.save();

        if(userRegister){
            return res.status(201).json({message:"succesfully register"})
        }
     }
        
    }catch(err){
         console.log(err)
         }
        })

 router.post('/signin',async(req,res)=>{

    try{
    

        const {email,password}=req.body;

        if(!email||!password){
            return res.status(400).json({err:"fill data"})
        }

        const userLogin = await User.findOne({email:email})

        if(userLogin){

        const isMatch= await bcrypt.compare(password,userLogin.password)

             //token
        const token =await userLogin.generateAuthToken();
        console.log(token)

        //cookie

        res.cookie('jwtoken',token,{
            expires:new Date(Date.now()+25892000000),
           httpOnly:true
        })


        if(!isMatch){
            return res.status(400).json({err:"invalid credentials"})
        }else{
            return res.json({message:"sigin successfully"})
        }

        }else{
            return res.status(400).json({err:"invalid credentials"})


        }
    }catch(err){
        console.log(err)

    }

 })
 
 //about us page

 router.get('/about',authenticate,(req,res)=>{
         res.send(req.rootUser)
    })

    //contact page

    router.get('/getdata',authenticate,(req,res)=>{
        res.send(req.rootUser)
    })

    router.post('/contact',authenticate,async(req,res)=>{

        try{

        const {name,email,phone,message}=req.body

        if(!name||!email||!phone||!message){
            return res.json({err:"fill"})
        }

        const userContact= await User.findOne({_id:req.userID})

        if(userContact){
            const userMessage=await userContact.addMessage(name,email,phone,message)

            await userContact.save()

            res.status(201).json({message:"successfully"})
        }

    }catch(error){
        console.log(error)

    }
        
    })

    router.get('/logout',(req,res)=>{
        console.log("hello")
        res.clearCookie('jwtoken',{path:"/"})
       res.status(200).send("user logout")
   })
 





module.exports=router