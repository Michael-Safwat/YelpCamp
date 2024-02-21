const express = require('express');
const router= express.Router();
const User= require('../models/user');

router.get('/register',(req,res)=>{
  res.render('../views/users/register');
})

router.post('/register',async(req,res)=>{
  const {email,username,password}  =req.body;
  const user=new User({email,username});
  const registeredUser=await User.register(user,password);
  console.log(registeredUser);
  req.flash('Welcome to Yelp Camp');
  res.redirect('/campgrounds');
})

module.exports=router;